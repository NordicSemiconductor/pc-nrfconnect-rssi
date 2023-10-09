/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import {
    DeviceSelector,
    logger,
} from '@nordicsemiconductor/pc-nrfconnect-shared';
import { DeviceTraits } from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil';

import * as deviceActions from './actions/deviceActions';

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
            deviceSetupConfig={deviceActions.deviceSetupConfig}
            deviceListing={deviceListing}
            onDeviceConnected={device =>
                logger.info(`Device Connected SN:${device.serialNumber}`)
            }
            onDeviceDisconnected={device =>
                logger.info(`Device Disconnected SN:${device.serialNumber}`)
            }
            onDeviceSelected={device =>
                logger.info(`Selected device with s/n ${device.serialNumber}`)
            }
            onDeviceIsReady={device => {
                logger.info(`Device isReady SN:${device.serialNumber}`);
                dispatch(deviceActions.openDevice(device));
            }}
            onDeviceDeselected={() => {
                logger.info('Deselected device');
                dispatch(deviceActions.closeDevice());
            }}
        />
    );
};
