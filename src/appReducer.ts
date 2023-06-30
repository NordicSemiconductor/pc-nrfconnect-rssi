/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import {
    NrfConnectState,
    RootState as SharedRootState,
} from 'pc-nrfconnect-shared';
import { combineReducers } from 'redux';

import rssiReducer from './features/rssiSlice';

type AppState = ReturnType<typeof appReducer>;

export type RootState = NrfConnectState<AppState & SharedRootState>;

const appReducer = combineReducers({
    rssi: rssiReducer,
});

export default appReducer;
