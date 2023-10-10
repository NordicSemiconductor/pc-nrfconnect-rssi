/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import {
    Alert,
    bleChannels,
    getReadbackProtection,
    Main,
    selectedDevice,
} from '@nordicsemiconductor/pc-nrfconnect-shared';
import { BarElement, CategoryScale, Chart, LinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { recoverHex } from '../rssiDevice/rssiDeviceEffects';
import {
    getAnimationDuration,
    getChannelRangeSorted,
    getLevelRangeSorted,
    getNoDataReceived,
    getRssi,
    getRssiMax,
} from '../rssiDevice/rssiDeviceSlice';
import color from './rssiColors';

import './alert.scss';

Chart.register(ChartDataLabels, BarElement, CategoryScale, LinearScale);

const rssiColors = bleChannels.map(channel =>
    bleChannels.isAdvertisement(channel)
        ? color.bar.advertisement
        : color.bar.normal
);

const rssiMaxColors = bleChannels.map(channel =>
    bleChannels.isAdvertisement(channel)
        ? color.bar.advertisementMax
        : color.bar.normalMax
);

const labels = bleChannels;

const selectBLEValues = (allData: readonly number[]) =>
    allData.slice(2).filter((_, index) => index % 2 === 0);

const isInRange = ([min, max]: readonly [number, number], value: number) =>
    value >= min && value <= max;

export default () => {
    const rssi = useSelector(getRssi);
    const rssiMax = useSelector(getRssiMax);
    const animationDuration = useSelector(getAnimationDuration);
    const channelRange = useSelector(getChannelRangeSorted);
    const [levelMin, levelMax] = useSelector(getLevelRangeSorted);
    const device = useSelector(selectedDevice);
    const readbackProtection = useSelector(getReadbackProtection);
    const noData = useSelector(getNoDataReceived);
    const dispatch = useDispatch();

    const convertInLevel = (v: number) => levelMin + levelMax - v;
    const limitToLevelRange = (v: number) => {
        if (v < levelMin) return levelMin;
        if (v > levelMax) return levelMax;
        return v;
    };

    const maskValuesOutsideChannelRange = (value: number, index: number) =>
        isInRange(channelRange, bleChannels[index]) ? value : levelMin - 1;

    const convertToScreenValue = (rawRssi: readonly number[]) =>
        selectBLEValues(rawRssi)
            .map(convertInLevel)
            .map(limitToLevelRange)
            .map(maskValuesOutsideChannelRange);

    return (
        <div className="d-flex flex-column h-100">
            {device && noData && readbackProtection === 'protected' && (
                <Alert variant="warning">
                    <div className="d-flex align-items-center readback-protection-warning flex-wrap">
                        No data received. Unable to verify compatible firmware
                        because the selected device has readback protection
                        enabled.
                        <button
                            type="button"
                            onClick={() => dispatch(recoverHex(device))}
                        >
                            Program compatible firmware
                        </button>
                    </div>
                </Alert>
            )}
            <div className="position-relative flex-grow-1 overflow-hidden">
                <Main>
                    <Bar
                        data={{
                            labels,
                            datasets: [
                                {
                                    label: 'rssi',
                                    backgroundColor: rssiColors,
                                    borderWidth: 0,
                                    data: convertToScreenValue(rssi),
                                    datalabels: { display: false },
                                },
                                {
                                    label: 'rssiMax',
                                    backgroundColor: rssiMaxColors,
                                    borderWidth: 0,
                                    data: convertToScreenValue(rssiMax),
                                    datalabels: {
                                        color: rssiColors,
                                        anchor: 'end',
                                        align: 'end',
                                        formatter: (v: number) =>
                                            v <= levelMin || v >= levelMax
                                                ? ''
                                                : convertInLevel(v),
                                        offset: -3,
                                        font: { size: 9 },
                                    },
                                },
                                {
                                    label: 'bgBars',
                                    backgroundColor: color.bar.background,
                                    borderWidth: 0,
                                    data: Array(81).fill(levelMax),
                                    datalabels: { display: false },
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            animation: { duration: animationDuration },
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: false },
                                tooltip: { enabled: false },
                            },
                            scales: {
                                xAxesTop: {
                                    type: 'category',
                                    position: 'top',
                                    offset: true,
                                    ticks: {
                                        callback: (_, index: number) =>
                                            String(bleChannels[index]).padStart(
                                                2,
                                                '0'
                                            ),
                                        minRotation: 0,
                                        maxRotation: 0,
                                        labelOffset: 0,
                                        autoSkipPadding: 5,
                                        color: color.label,
                                    },
                                    stacked: true,
                                    title: {
                                        display: true,
                                        text: 'Bluetooth Low Energy Channel',
                                        color: color.label,
                                        font: { size: 14 },
                                    },
                                    grid: {
                                        display: false,
                                    },
                                    border: {
                                        display: false,
                                    },
                                },
                                x: {
                                    type: 'category',
                                    position: 'bottom',
                                    offset: true,
                                    ticks: {
                                        callback: (_, index) =>
                                            2402 + 2 * index,
                                        minRotation: 90,
                                        labelOffset: 0,
                                        autoSkipPadding: 5,
                                        color: color.label,
                                    },
                                    title: {
                                        display: true,
                                        text: 'MHz',
                                        color: color.label,
                                        font: { size: 14 },
                                        padding: { top: 10 },
                                    },
                                    grid: {
                                        offset: true,
                                        display: false,
                                    },
                                    border: {
                                        display: false,
                                    },
                                    stacked: true,
                                },
                                y: {
                                    type: 'linear',
                                    title: {
                                        display: true,
                                        text: 'dBm',
                                        color: color.label,
                                        font: { size: 14 },
                                    },
                                    grid: {
                                        display: false,
                                    },
                                    border: {
                                        display: false,
                                    },
                                    ticks: {
                                        callback: v =>
                                            Number.parseFloat(v.toString()) -
                                            levelMin -
                                            levelMax,
                                        color: color.label,
                                    },
                                    min: levelMin,
                                    max: levelMax,
                                },
                            },
                        }}
                    />
                </Main>
            </div>
        </div>
    );
};
