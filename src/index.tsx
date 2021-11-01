/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { App } from 'pc-nrfconnect-shared';

import Chart from './Chart/Chart';
import reducer from './reducer';
import RssiDeviceSelect from './RssiDeviceSelect';
import SidePanel from './SidePanel/SidePanel';

export default () => (
    <App
        appReducer={reducer}
        deviceSelect={<RssiDeviceSelect />}
        sidePanel={<SidePanel />}
        panes={[{ name: 'RSSI Viewer', Main: Chart }]}
    />
);
