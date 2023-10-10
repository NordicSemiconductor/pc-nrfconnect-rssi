/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { NrfConnectState } from '@nordicsemiconductor/pc-nrfconnect-shared';
import { combineReducers } from 'redux';

import rssi from '../features/rssiDevice/rssiDeviceSlice';

export const reducer = combineReducers({
    rssi,
});

type AppState = ReturnType<typeof reducer>;

export type RootState = NrfConnectState<AppState>;
