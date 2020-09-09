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

export const TOGGLE_PAUSE = 'TOGGLE_PAUSE';
export const togglePause = () => ({
    type: TOGGLE_PAUSE,
});

export const PORT_OPENED = 'PORT_OPENED';
export const portOpened = portName => ({
    type: PORT_OPENED,
    portName,
});

export const PORT_CLOSED = 'PORT_CLOSED';
export const portClosed = () => ({
    type: PORT_CLOSED,
});

export const SET_DELAY = 'SET_DELAY';
export const setDelay = delay => ({
    type: SET_DELAY,
    delay,
});

export const SET_MAX_SCANS = 'SET_MAX_SCANS';
export const setMaxScans = maxScans => ({
    type: SET_MAX_SCANS,
    maxScans,
});

export const SET_SCAN_REPEAT = 'SET_SCAN_REPEAT';
export const setScanRepeat = scanRepeat => ({
    type: SET_SCAN_REPEAT,
    scanRepeat,
});

export const SET_ANIMATION_DURATION = 'SET_ANIMATION_DURATION';
export const setAnimationDuration = animationDuration => ({
    type: SET_ANIMATION_DURATION,
    animationDuration,
});

export const SET_CHANNEL_RANGE = 'SET_CHANNEL_RANGE';
export const setChannelRange = channelRange => ({
    type: SET_CHANNEL_RANGE,
    channelRange,
});

export const SET_LEVEL_RANGE = 'SET_LEVEL_RANGE';
export const setLevelRange = levelRange => ({
    type: SET_LEVEL_RANGE,
    levelRange,
});

export const RECEIVE_RSSI_DATA = 'RECEIVE_RSSI_DATA';
export const receiveRssiData = rawData => ({
    type: RECEIVE_RSSI_DATA,
    rawData,
});

export const CLEAR_RSSI_DATA = 'CLEAR_RSSI_DATA';
export const clearRssiData = () => ({
    type: CLEAR_RSSI_DATA,
});
