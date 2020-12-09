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

export enum RssiActionType {
    TOGGLE_PAUSE = 'TOGGLE_PAUSE',
    PORT_OPENED = 'PORT_OPENED',
    PORT_CLOSED = 'PORT_CLOSED',
    SET_DELAY = 'SET_DELAY',
    SET_MAX_SCANS = 'SET_MAX_SCANS',
    SET_SCAN_REPEAT = 'SET_SCAN_REPEAT',
    SET_ANIMATION_DURATION = 'SET_ANIMATION_DURATION',
    SET_CHANNEL_RANGE = 'SET_CHANNEL_RANGE',
    SET_LEVEL_RANGE = 'SET_LEVEL_RANGE',
    RECEIVE_RSSI_DATA = 'RECEIVE_RSSI_DATA',
    CLEAR_RSSI_DATA = 'CLEAR_RSSI_DATA',
}

interface TogglePause {
    type: RssiActionType.TOGGLE_PAUSE;
}
export const togglePause = (): TogglePause => ({
    type: RssiActionType.TOGGLE_PAUSE,
});

interface PortOpened {
    type: RssiActionType.PORT_OPENED;
    portName: string;
}
export const portOpened = (portName: string): PortOpened => ({
    type: RssiActionType.PORT_OPENED,
    portName,
});

interface PortClosed {
    type: RssiActionType.PORT_CLOSED;
}
export const portClosed = (): PortClosed => ({
    type: RssiActionType.PORT_CLOSED,
});

interface SetDelay {
    type: RssiActionType.SET_DELAY;
    delay: number;
}
export const setDelay = (delay: number): SetDelay => ({
    type: RssiActionType.SET_DELAY,
    delay,
});

interface SetMaxScans {
    type: RssiActionType.SET_MAX_SCANS;
    maxScans: number;
}
export const setMaxScans = (maxScans: number): SetMaxScans => ({
    type: RssiActionType.SET_MAX_SCANS,
    maxScans,
});

interface SetScanRepeat {
    type: RssiActionType.SET_SCAN_REPEAT;
    scanRepeat: number;
}
export const setScanRepeat = (scanRepeat: number): SetScanRepeat => ({
    type: RssiActionType.SET_SCAN_REPEAT,
    scanRepeat,
});

interface SetAnimationDuration {
    type: RssiActionType.SET_ANIMATION_DURATION;
    animationDuration: number;
}
export const setAnimationDuration = (
    animationDuration: number
): SetAnimationDuration => ({
    type: RssiActionType.SET_ANIMATION_DURATION,
    animationDuration,
});

interface SetChannelRange {
    type: RssiActionType.SET_CHANNEL_RANGE;
    channelRange: [number, number];
}
export const setChannelRange = (
    channelRange: [number, number]
): SetChannelRange => ({
    type: RssiActionType.SET_CHANNEL_RANGE,
    channelRange,
});

interface SetLevelRange {
    type: RssiActionType.SET_LEVEL_RANGE;
    levelRange: [number, number];
}
export const setLevelRange = (levelRange: [number, number]): SetLevelRange => ({
    type: RssiActionType.SET_LEVEL_RANGE,
    levelRange,
});

interface ReceiveRssiData {
    type: RssiActionType.RECEIVE_RSSI_DATA;
    rawData: Buffer;
}
export const receiveRssiData = (rawData: Buffer): ReceiveRssiData => ({
    type: RssiActionType.RECEIVE_RSSI_DATA,
    rawData,
});

interface ClearRssiData {
    type: RssiActionType.CLEAR_RSSI_DATA;
}
export const clearRssiData = (): ClearRssiData => ({
    type: RssiActionType.CLEAR_RSSI_DATA,
});

export type RssiAction =
    | TogglePause
    | PortOpened
    | PortClosed
    | SetDelay
    | SetMaxScans
    | SetScanRepeat
    | SetAnimationDuration
    | SetChannelRange
    | SetLevelRange
    | ReceiveRssiData
    | ClearRssiData;
