/*
 * Copyright (c) 2021 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AutoDetectTypes } from '@serialport/bindings-cpp';
import { bleChannels } from 'pc-nrfconnect-shared';
import { SerialPort } from 'serialport';

import type { RootState } from '../../app/appReducer';
import { RssiDevice } from './rssiDevice';

const initialData = () => new Array(81).fill(undefined).map(() => []);

type NumberPair = readonly [number, number];

const sortedPair = ([a, b]: NumberPair): NumberPair =>
    a < b ? [a, b] : [b, a];

export const initialLevelRange = {
    min: 20,
    max: 110,
};

interface RssiState {
    isPaused: boolean;
    buffer: readonly number[];
    data: readonly (readonly number[])[];
    dataMax: readonly number[];
    delay: number;
    scanRepeat: number;
    maxScans: number;
    animationDuration: number;
    channelRange: NumberPair;
    levelRange: NumberPair;
    noDataReceived: boolean;
    serialPort?: SerialPort<AutoDetectTypes>;
    rssiDevice?: RssiDevice;
}

const initialState: RssiState = {
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
    noDataReceived: false,
};

const deviceSlice = createSlice({
    name: 'rssi',
    initialState,
    reducers: {
        setSerialPort: (
            state,
            action: PayloadAction<SerialPort<AutoDetectTypes>>
        ) => {
            state.serialPort = action.payload;
        },
        setRssiDevice: (state, action: PayloadAction<RssiDevice>) => {
            state.rssiDevice = action.payload;
        },

        clearSerialPort: state => {
            state.serialPort = undefined;
            state.rssiDevice = undefined;
        },

        toggleIsPaused: state => {
            state.isPaused = !state.isPaused;
        },

        clearRssiData: state => {
            state.data = initialData();
            state.dataMax = [];
            state.noDataReceived = false;
        },

        resetRssiStore: state => {
            state.buffer = [];
            state.data = initialData();
            state.dataMax = [];
            state.noDataReceived = false;
            state.isPaused = false;
        },

        setDelay: (state, action: PayloadAction<number>) => {
            state.delay = action.payload;
        },

        setMaxScans: (state, action: PayloadAction<number>) => {
            state.maxScans = action.payload;
        },

        setScanRepeat: (state, action: PayloadAction<number>) => {
            state.scanRepeat = action.payload;
        },

        setAnimationDuration: (state, action: PayloadAction<number>) => {
            state.animationDuration = action.payload;
        },

        setChannelRange: (state, action: PayloadAction<[number, number]>) => {
            state.channelRange = action.payload;
        },

        setLevelRange: (state, action: PayloadAction<[number, number]>) => {
            state.levelRange = action.payload;
        },

        onReceiveRssiData: (state, action: PayloadAction<Buffer>) => {
            if (!state.serialPort || !state.serialPort.isOpen) {
                state.data = initialData();
                state.dataMax = [];
                return;
            }

            if (state.isPaused) {
                return;
            }

            state.buffer = [...state.buffer, ...action.payload];

            if (state.buffer.length > 246) {
                state.buffer.splice(0, state.buffer.length - 246);
            }
            while (state.buffer.length >= 3) {
                while (state.buffer.length && state.buffer.shift() !== 0xff);

                const [ch, d] = state.buffer.splice(0, 2);
                if (ch !== 0xff && d !== 0xff) {
                    state.data[ch] = [d, ...state.data[ch]];
                    state.data[ch].splice(state.maxScans);
                    state.dataMax[ch] = Math.min(...state.data[ch]);
                }
            }
        },

        onReceiveNoRssiData: state => {
            if (state.isPaused) {
                return;
            }
            state.noDataReceived = true;
        },
    },
});

export const getSerialPort = (state: RootState) => state.app.rssi.serialPort;
export const getRssiDevice = (state: RootState) => state.app.rssi.rssiDevice;
export const getIsConnected = (state: RootState) => !!state.app.rssi.serialPort;
export const getIsPaused = (state: RootState) => state.app.rssi.isPaused;

export const getRssi = (state: RootState) =>
    state.app.rssi.data.map(scan => scan[0]);
export const getRssiMax = (state: RootState) => state.app.rssi.dataMax;
export const getAnimationDuration = (state: RootState) =>
    state.app.rssi.animationDuration;
export const getDelay = (state: RootState) => state.app.rssi.delay;
export const getMaxScans = (state: RootState) => state.app.rssi.maxScans;
export const getScanRepeat = (state: RootState) => state.app.rssi.scanRepeat;

export const getChannelRange = (state: RootState) =>
    state.app.rssi.channelRange;
export const getChannelRangeSorted = (state: RootState) =>
    sortedPair(getChannelRange(state));

export const getLevelRange = (state: RootState) => state.app.rssi.levelRange;
export const getLevelRangeSorted = (state: RootState) =>
    sortedPair(getLevelRange(state));

export const getNoDataReceived = (state: RootState) =>
    state.app.rssi.noDataReceived;

export const {
    setSerialPort,
    setRssiDevice,
    clearSerialPort,
    toggleIsPaused,
    resetRssiStore,
    clearRssiData,
    setDelay,
    setMaxScans,
    setScanRepeat,
    setAnimationDuration,
    setChannelRange,
    setLevelRange,
    onReceiveRssiData,
    onReceiveNoRssiData,
} = deviceSlice.actions;
export default deviceSlice.reducer;
