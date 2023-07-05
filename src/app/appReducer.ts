/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { NrfConnectState } from 'pc-nrfconnect-shared';
import { combineReducers } from 'redux';

import rssiReducer from '../features/device/deviceSlice';

type AppState = ReturnType<typeof appReducer>;

export type RootState = NrfConnectState<AppState>;

const appReducer = combineReducers({
    rssi: rssiReducer,
});

export default appReducer;
