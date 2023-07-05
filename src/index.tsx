/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { App } from 'pc-nrfconnect-shared';

import appReducer from './app/appReducer';
import DeviceSelector from './app/DeviceSelector';
import SidePanel from './app/SidePanel/SidePanel';
import Chart from './features/chart/Chart';

export default () => (
    <App
        appReducer={appReducer}
        deviceSelect={<DeviceSelector />}
        sidePanel={<SidePanel />}
        panes={[{ name: 'RSSI Viewer', Main: Chart }]}
    />
);
