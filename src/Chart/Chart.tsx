/* Copyright (c) 2015 - 2017, Nordic Semiconductor ASA
 *
 * All rights reserved.
 *
 * Use in source and binary forms, redistribution in binary form only, with
 * or without modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions in binary form, except as embedded into a Nordic
 *    Semiconductor ASA integrated circuit in a product or a software update for
 *    such product, must reproduce the above copyright notice, this list of
 *    conditions and the following disclaimer in the documentation and/or other
 *    materials provided with the distribution.
 *
 * 2. Neither the name of Nordic Semiconductor ASA nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * 3. This software, with or without modification, must only be used with a Nordic
 *    Semiconductor ASA integrated circuit.
 *
 * 4. Any software provided in binary form under this license must not be reverse
 *    engineered, decompiled, modified and/or disassembled.
 *
 * THIS SOFTWARE IS PROVIDED BY NORDIC SEMICONDUCTOR ASA "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY, NONINFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL NORDIC SEMICONDUCTOR ASA OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
 * TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import React from 'react';
import { Main, bleChannels } from 'pc-nrfconnect-shared';
import { Bar } from 'react-chartjs-2';
import { Chart } from 'chart.js';

import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useSelector } from 'react-redux';
import {
    getRssi,
    getRssiMax,
    getAnimationDuration,
    getChannelRangeSorted,
    getLevelRangeSorted,
} from '../reducer';
import color from './rssiColors';

import './chart.scss';

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

const selectBLEValues = (allData: number[]) =>
    allData.slice(2).filter((_, index) => index % 2 === 0);

const isInRange = ([min, max]: [number, number], value: number) =>
    value >= min && value <= max;

export default () => {
    const rssi = useSelector(getRssi);
    const rssiMax = useSelector(getRssiMax);
    const animationDuration = useSelector(getAnimationDuration);
    const channelRange = useSelector(getChannelRangeSorted);
    const [levelMin, levelMax] = useSelector(getLevelRangeSorted);

    const convertInLevel = (v: number) => levelMin + levelMax - v;
    const limitToLevelRange = (v: number) => {
        if (v < levelMin) return levelMin;
        if (v > levelMax) return levelMax;
        return v;
    };

    const maskValuesOutsideChannelRange = (value: number, index: number) =>
        isInRange(channelRange, bleChannels[index]) ? value : levelMin - 1;

    const convertToScreenValue = (rawRssi: number[]) =>
        selectBLEValues(rawRssi)
            .map(convertInLevel)
            .map(limitToLevelRange)
            .map(maskValuesOutsideChannelRange);

    return (
        <Main>
            <div className="chart-container">
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
                                        callback: (_: number, index: number) =>
                                            String(bleChannels[index]).padStart(
                                                2,
                                                '0'
                                            ),
                                        minRotation: 0,
                                        maxRotation: 0,
                                        labelOffset: 0,
                                        autoSkipPadding: 5,
                                        fontColor: color.label,
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'BLE channel',
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
                                        callback: (_: number, index: number) =>
                                            2402 + 2 * index,
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
            </div>
        </Main>
    );
};
