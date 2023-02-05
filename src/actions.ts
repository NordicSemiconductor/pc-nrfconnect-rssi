/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
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
    RECEIVE_NO_RSSI_DATA = 'RECEIVE_NO_RSSI_DATA',
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

interface ReceiveNoRssiData {
    type: RssiActionType.RECEIVE_NO_RSSI_DATA;
}
export const receiveNoRssiData = (): ReceiveNoRssiData => ({
    type: RssiActionType.RECEIVE_NO_RSSI_DATA,
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
    | ClearRssiData
    | ReceiveNoRssiData;
