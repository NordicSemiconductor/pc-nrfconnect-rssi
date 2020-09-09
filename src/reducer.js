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

import { bleChannels } from 'pc-nrfconnect-shared';

import {
    CLEAR_RSSI_DATA,
    PORT_CLOSED,
    PORT_OPENED,
    RECEIVE_RSSI_DATA,
    SET_ANIMATION_DURATION,
    SET_CHANNEL_RANGE,
    SET_DELAY,
    SET_LEVEL_RANGE,
    SET_MAX_SCANS,
    SET_SCAN_REPEAT,
    TOGGLE_PAUSE,
} from './actions';

export const initialLevelRange = {
    min: 20,
    max: 110,
};

const initialData = () => new Array(81).fill().map(() => []);

const initialState = {
    isPaused: false,
    buffer: [],
    data: initialData(),
    dataMax: [],
    delay: 10,
    scanRepeat: 1,
    maxScans: 30,
    animationDuration: 500,
    channelRange: [bleChannels.min, bleChannels.max],
    levelRange: [initialLevelRange.min, initialLevelRange.max],
    port: null,
};

const updateData = (rawData, oldState) => {
    const data = [...oldState.data];
    const dataMax = [...oldState.dataMax];
    const buffer = [...oldState.buffer, ...rawData];

    if (buffer.length > 246) {
        buffer.splice(0, buffer.length - 246);
    }
    while (buffer.length >= 3) {
        while (buffer.splice(0, 1)[0] !== 0xff);

        const [ch, d] = buffer.splice(0, 2);
        if (ch !== 0xff && d !== 0xff) {
            data[ch] = [d, ...data[ch]];
            data[ch].splice(oldState.maxScans);
            dataMax[ch] = Math.min(...data[ch]);
        }
    }

    return { data, dataMax, buffer };
};

export default (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_PAUSE:
            return {
                ...state,
                isPaused: !state.isPaused,
            };
        case RECEIVE_RSSI_DATA:
            if (state.isPaused) {
                return state;
            }
            return {
                ...state,
                ...updateData(action.rawData, state),
            };
        case CLEAR_RSSI_DATA:
            return {
                ...state,
                data: initialData(),
                dataMax: [],
            };
        case SET_DELAY:
            return {
                ...state,
                delay: action.delay,
            };
        case SET_MAX_SCANS:
            return {
                ...state,
                maxScans: action.maxScans,
            };
        case SET_SCAN_REPEAT:
            return {
                ...state,
                scanRepeat: action.scanRepeat,
            };
        case SET_ANIMATION_DURATION:
            return {
                ...state,
                animationDuration: action.animationDuration,
            };
        case SET_CHANNEL_RANGE:
            return {
                ...state,
                channelRange: action.channelRange,
            };
        case SET_LEVEL_RANGE:
            return {
                ...state,
                levelRange: action.levelRange,
            };
        case PORT_OPENED:
            return {
                ...state,
                port: action.portName,
                isPaused: false,
            };
        case PORT_CLOSED:
            return {
                ...state,
                port: null,
                isPaused: true,
            };
        default:
            return state;
    }
};

export const getIsConnected = state => state.app.port != null;
export const getIsPaused = state => state.app.isPaused;

export const getRssi = state => state.app.data.map(scan => scan[0]);
export const getRssiMax = state => state.app.dataMax;
export const getAnimationDuration = state => state.app.animationDuration;
export const getDelay = state => state.app.delay;
export const getMaxScans = state => state.app.maxScans;
export const getScanRepeat = state => state.app.scanRepeat;

export const getChannelRange = state => state.app.channelRange;
export const getChannelRangeSorted = state =>
    [...state.app.channelRange].sort((a, b) => a - b);

export const getLevelRange = state => state.app.levelRange;
export const getLevelRangeSorted = state =>
    [...state.app.levelRange].sort((a, b) => a - b);
