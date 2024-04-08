/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import {
    App,
    render,
    telemetry,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import DeviceSelector from './app/DeviceSelector';
import SidePanel from './app/SidePanel/SidePanel';
import { reducer } from './app/store';
import Chart from './features/Chart/Chart';

telemetry.enableTelemetry();

render(
    <App
        appReducer={reducer}
        deviceSelect={<DeviceSelector />}
        sidePanel={<SidePanel />}
        panes={[{ name: 'RSSI Viewer', Main: Chart }]}
    />
);
