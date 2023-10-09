/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { NrfConnectState } from '@nordicsemiconductor/pc-nrfconnect-shared';
import { combineReducers } from 'redux';

import rssiReducer from './features/rssiSlice';

type AppState = ReturnType<typeof appReducer>;

export type RootState = NrfConnectState<AppState>;

const appReducer = combineReducers({
    rssi: rssiReducer,
});

export default appReducer;
