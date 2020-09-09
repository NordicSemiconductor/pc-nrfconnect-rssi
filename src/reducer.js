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
import produce from 'immer';

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

const updateData = (rawData, draft) => {
    draft.buffer = [...draft.buffer, ...rawData];

    if (draft.buffer.length > 246) {
        draft.buffer.splice(0, draft.buffer.length - 246);
    }
    while (draft.buffer.length >= 3) {
        while (draft.buffer.splice(0, 1)[0] !== 0xff);

        const [ch, d] = draft.buffer.splice(0, 2);
        if (ch !== 0xff && d !== 0xff) {
            draft.data[ch] = [d, ...draft.data[ch]];
            draft.data[ch].splice(draft.maxScans);
            draft.dataMax[ch] = Math.min(...draft.data[ch]);
        }
    }
};

export default produce((draft, action) => {
    // eslint-disable-next-line default-case -- we can neglect default case for reducers with immmer
    switch (action.type) {
        case TOGGLE_PAUSE:
            draft.isPaused = !draft.isPaused;
            break;

        case RECEIVE_RSSI_DATA:
            if (draft.isPaused) {
                break;
            }
            updateData(action.rawData, draft);
            break;

        case CLEAR_RSSI_DATA:
            draft.data = initialData();
            draft.dataMax = [];
            break;

        case SET_DELAY:
            draft.delay = action.delay;
            break;

        case SET_MAX_SCANS:
            draft.maxScans = action.maxScans;
            break;

        case SET_SCAN_REPEAT:
            draft.scanRepeat = action.scanRepeat;
            break;

        case SET_ANIMATION_DURATION:
            draft.animationDuration = action.animationDuration;
            break;

        case SET_CHANNEL_RANGE:
            draft.channelRange = action.channelRange;
            break;

        case SET_LEVEL_RANGE:
            draft.levelRange = action.levelRange;
            break;

        case PORT_OPENED:
            draft.port = action.portName;
            draft.isPaused = false;
            break;

        case PORT_CLOSED:
            draft.port = null;
            draft.isPaused = true;
    }
}, initialState);

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
