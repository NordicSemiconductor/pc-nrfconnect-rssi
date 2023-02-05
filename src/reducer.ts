/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import produce, { Draft } from 'immer';
import { bleChannels, NrfConnectState } from 'pc-nrfconnect-shared';

import { RssiAction, RssiActionType } from './actions';

export const initialLevelRange = {
    min: 20,
    max: 110,
};

const initialData = () => new Array(81).fill(undefined).map(() => []);

type NumberPair = readonly [number, number];

interface RssiState {
    readonly isPaused: boolean;
    readonly buffer: readonly number[];
    readonly data: readonly (readonly number[])[];
    readonly dataMax: readonly number[];
    readonly delay: number;
    readonly scanRepeat: number;
    readonly maxScans: number;
    readonly animationDuration: number;
    readonly channelRange: NumberPair;
    readonly levelRange: NumberPair;
    readonly port: string | null;
    readonly noDataReceived: boolean;
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
    port: null,
    noDataReceived: false,
};

const updateData = (rawData: Buffer, draft: Draft<RssiState>) => {
    draft.buffer = [...draft.buffer, ...rawData];

    if (draft.buffer.length > 246) {
        draft.buffer.splice(0, draft.buffer.length - 246);
    }
    while (draft.buffer.length >= 3) {
        while (draft.buffer.length && draft.buffer.shift() !== 0xff);

        const [ch, d] = draft.buffer.splice(0, 2);
        if (ch !== 0xff && d !== 0xff) {
            draft.data[ch] = [d, ...draft.data[ch]];
            draft.data[ch].splice(draft.maxScans);
            draft.dataMax[ch] = Math.min(...draft.data[ch]);
        }
    }
};

export default produce((draft: Draft<RssiState>, action: RssiAction) => {
    switch (action.type) {
        case RssiActionType.TOGGLE_PAUSE:
            draft.isPaused = !draft.isPaused;
            break;

        case RssiActionType.RECEIVE_RSSI_DATA:
            if (draft.isPaused) {
                break;
            }
            updateData(action.rawData, draft);
            break;

        case RssiActionType.RECEIVE_NO_RSSI_DATA:
            if (draft.isPaused) {
                break;
            }
            draft.noDataReceived = true;
            break;

        case RssiActionType.CLEAR_RSSI_DATA:
            draft.data = initialData();
            draft.dataMax = [];
            break;

        case RssiActionType.SET_DELAY:
            draft.delay = action.delay;
            break;

        case RssiActionType.SET_MAX_SCANS:
            draft.maxScans = action.maxScans;
            break;

        case RssiActionType.SET_SCAN_REPEAT:
            draft.scanRepeat = action.scanRepeat;
            break;

        case RssiActionType.SET_ANIMATION_DURATION:
            draft.animationDuration = action.animationDuration;
            break;

        case RssiActionType.SET_CHANNEL_RANGE:
            draft.channelRange = action.channelRange;
            break;

        case RssiActionType.SET_LEVEL_RANGE:
            draft.levelRange = action.levelRange;
            break;

        case RssiActionType.PORT_OPENED:
            draft.port = action.portName;
            draft.isPaused = false;
            draft.noDataReceived = false;
            break;

        case RssiActionType.PORT_CLOSED:
            draft.port = null;
            draft.isPaused = true;
    }
}, initialState);

type AppState = NrfConnectState<RssiState>;

const sortedPair = ([a, b]: NumberPair): NumberPair =>
    a < b ? [a, b] : [b, a];

export const getIsConnected = (state: AppState) => state.app.port != null;
export const getIsPaused = (state: AppState) => state.app.isPaused;

export const getRssi = (state: AppState) => state.app.data.map(scan => scan[0]);
export const getRssiMax = (state: AppState) => state.app.dataMax;
export const getAnimationDuration = (state: AppState) =>
    state.app.animationDuration;
export const getDelay = (state: AppState) => state.app.delay;
export const getMaxScans = (state: AppState) => state.app.maxScans;
export const getScanRepeat = (state: AppState) => state.app.scanRepeat;

export const getChannelRange = (state: AppState) => state.app.channelRange;
export const getChannelRangeSorted = (state: AppState) =>
    sortedPair(getChannelRange(state));

export const getLevelRange = (state: AppState) => state.app.levelRange;
export const getLevelRangeSorted = (state: AppState) =>
    sortedPair(getLevelRange(state));

export const getNoDataReceived = (state: AppState) => state.app.noDataReceived;
