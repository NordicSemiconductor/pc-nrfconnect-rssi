/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import { DeviceSelector } from '@nordicsemiconductor/pc-nrfconnect-shared';
import { DeviceTraits } from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil/device';

import {
    closeDevice,
    deviceSetupConfig,
    openDevice,
} from '../features/rssiDevice/rssiDeviceEffects';

const deviceListing: DeviceTraits = {
    nordicUsb: true,
    serialPorts: true,
    jlink: true,
    nordicDfu: true,
};

export default () => {
    const dispatch = useDispatch();

    return (
        <DeviceSelector
            deviceSetupConfig={deviceSetupConfig}
            deviceListing={deviceListing}
            onDeviceIsReady={device => {
                dispatch(openDevice(device));
            }}
            onDeviceDeselected={() => {
                dispatch(closeDevice());
            }}
        />
    );
};
