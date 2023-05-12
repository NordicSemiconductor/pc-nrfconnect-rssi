/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
    Alert,
    bleChannels,
    Button,
    getReadbackProtection,
    Main,
    selectedDevice,
} from 'pc-nrfconnect-shared';

import { recoverHex } from '../actions/deviceActions';
import {
    getAnimationDuration,
    getChannelRangeSorted,
    getLevelRangeSorted,
    getNoDataReceived,
    getRssi,
    getRssiMax,
} from '../features/rssiSlice';
import color from './rssiColors';

import './alert.scss';

Chart.plugins.register(ChartDataLabels);

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
                    <div className="d-flex align-items-center flex-wrap readback-protection-warning">
                        No data received. Unable to verify compatible firmware
                        because the selected device has readback protection
                        enabled.
                        <Button
                            onClick={() => dispatch(recoverHex(device))}
                            variant="custom"
                        >
                            Program compatible firmware
                        </Button>
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
                            legend: { display: false },
                            tooltips: { enabled: false },
                            scales: {
                                xAxes: [
                                    {
                                        type: 'category',
                                        position: 'top',
                                        offset: true,
                                        ticks: {
                                            callback: (
                                                _: number,
                                                index: number
                                            ) =>
                                                String(
                                                    bleChannels[index]
                                                ).padStart(2, '0'),
                                            minRotation: 0,
                                            maxRotation: 0,
                                            labelOffset: 0,
                                            autoSkipPadding: 5,
                                            fontColor: color.label,
                                        },
                                        scaleLabel: {
                                            display: true,
                                            labelString:
                                                'Bluetooth Low Energy Channel',
                                            fontColor: color.label,
                                            fontSize: 14,
                                        },
                                        gridLines: {
                                            display: false,
                                        },
                                        stacked: true,
                                    },
                                    {
                                        type: 'category',
                                        position: 'bottom',
                                        offset: true,
                                        ticks: {
                                            callback: (
                                                _: number,
                                                index: number
                                            ) => 2402 + 2 * index,
                                            minRotation: 90,
                                            labelOffset: 0,
                                            autoSkipPadding: 5,
                                            fontColor: color.label,
                                        },
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'MHz',
                                            fontColor: color.label,
                                            fontSize: 14,
                                            padding: { top: 10 },
                                        },
                                        gridLines: {
                                            offsetGridLines: true,
                                            display: false,
                                            drawBorder: false,
                                        },
                                        stacked: true,
                                    },
                                ],
                                yAxes: [
                                    {
                                        type: 'linear',
                                        ticks: {
                                            callback: (v: number) =>
                                                v - levelMin - levelMax,
                                            min: levelMin,
                                            max: levelMax,
                                            fontColor: color.label,
                                        },
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'dBm',
                                            fontColor: color.label,
                                            fontSize: 14,
                                        },
                                        gridLines: {
                                            display: false,
                                            drawBorder: false,
                                        },
                                    },
                                ],
                            },
                        }}
                    />
                </Main>
            </div>
        </div>
    );
};
