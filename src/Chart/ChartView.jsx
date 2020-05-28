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
import { arrayOf, number } from 'prop-types';
import { Main } from 'pc-nrfconnect-shared';
import { Bar, Chart } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.plugins.register(ChartDataLabels);

const bleChannels = Array.from(Array(37), (_, x) => x);
bleChannels.unshift(37);
bleChannels.splice(12, 0, 38);
bleChannels.push(39);

// Official Nordic colors, taken from https://github.com/NordicSemiconductor/pc-nrfconnect-shared/blob/9bb1f72849/src/variables.scss

const blueSlate = '#0033a0';
const green = '#4caf50';

const blueSlateLighter = '#7c98d3'; // result of using color.scale($blue-slate, $lightness: 50%, $saturation: -50%) in sass
const greenLighter = '#b1cbb3'; // result of using color.scale($green, $lightness: 50%, $saturation: -50%) in sass

const gray50 = '#eceff1';
const gray300 = '#90a4ae';

const color = {
    label: gray300,
    bar: {
        normal: blueSlate,
        normalMax: blueSlateLighter,
        advertisement: green,
        advertisementMax: greenLighter,
        background: gray50,
    },
};

const interlace = arr => arr.map(v => [v.toString().padStart(2, '0'), undefined]).flat();
const bleChannelTicks = interlace(bleChannels);
bleChannelTicks.unshift(undefined, undefined);

const rssiColors = Array.from(Array(81), () => color.bar.normal);
[2, 26, 80].forEach(k => { rssiColors[k] = color.bar.advertisement; });

const rssiMaxColors = Array.from(Array(81), () => color.bar.normalMax);
[2, 26, 80].forEach(k => { rssiMaxColors[k] = color.bar.advertisementMax; });

const labels = Array.from(Array(81).keys());

const ChartView = ({
    rssi, rssiMax, animationDuration, yMin, yMax,
}) => (
    <Main>
        <Bar
            data={{
                labels,
                datasets: [{
                    label: 'rssi',
                    backgroundColor: rssiColors,
                    borderWidth: 0,
                    data: rssi,
                    datalabels: {
                        display: false,
                    },
                }, {
                    label: 'rssiMax',
                    backgroundColor: rssiMaxColors,
                    borderWidth: 0,
                    data: rssiMax,
                    datalabels: {
                        color: rssiColors,
                        anchor: 'end',
                        align: 'end',
                        formatter: v => ((v > (-80 - yMin)) ? ((20 - v) - yMin) : ''),
                        offset: -3,
                        font: { size: 9 },
                    },
                }, {
                    label: 'bgBars',
                    backgroundColor: color.bar.background,
                    borderWidth: 0,
                    data: Array(81).fill(-yMin),
                    datalabels: {
                        display: false,
                    },
                }],
            }}
            options={{
                animation: { duration: animationDuration },
                maintainAspectRatio: false,
                legend: { display: false },
                tooltips: { enabled: false },
                scales: {
                    xAxes: [{
                        type: 'category',
                        position: 'top',
                        offset: true,
                        ticks: {
                            callback: v => bleChannelTicks[v],
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
                            offsetGridLines: true,
                            display: false,
                            drawBorder: false,
                            fontColor: color.label,
                        },
                        stacked: true,
                    }, {
                        type: 'category',
                        position: 'bottom',
                        offset: true,
                        ticks: {
                            callback: v => ((v % 2) === 0 ? 2400 + v : ''),
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
                            fontColor: color.label,
                        },
                        stacked: true,
                    }],
                    yAxes: [{
                        type: 'linear',
                        min: -yMax,
                        max: -yMin,
                        ticks: {
                            callback: v => yMax + v + yMin,
                            min: -yMax,
                            max: -yMin,
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
                    }],
                },
            }}
        />
    </Main>
);

ChartView.propTypes = {
    rssi: arrayOf(Number).isRequired,
    rssiMax: arrayOf(Number).isRequired,
    animationDuration: number.isRequired,
    yMin: number.isRequired,
    yMax: number.isRequired,
};

export default ChartView;
