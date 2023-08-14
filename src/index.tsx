/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { App, render } from '@nordicsemiconductor/pc-nrfconnect-shared';

import appReducer from './appReducer';
import Chart from './Chart/Chart';
import DeviceSelector from './DeviceSelector';
import SidePanel from './SidePanel/SidePanel';

render(
    <App
        appReducer={appReducer}
        deviceSelect={<DeviceSelector />}
        sidePanel={<SidePanel />}
        panes={[{ name: 'RSSI Viewer', Main: Chart }]}
    />
);
