/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    DeviceSelector,
    logger,
    preventSleep,
    selectedDevice,
} from '@nordicsemiconductor/pc-nrfconnect-shared';
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
    const currentDevice = useSelector(selectedDevice);

    useEffect(() => {
        if (!currentDevice) return;

        let preventSleepId: number | undefined;

        preventSleep.start().then(id => {
            preventSleepId = id;
        });

        return () => {
            if (preventSleepId != null) {
                preventSleep.end(preventSleepId);
            }
        };
    }, [currentDevice]);

    return (
        <DeviceSelector
            deviceSetupConfig={deviceSetupConfig}
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
                dispatch(openDevice(device));
            }}
            onDeviceDeselected={() => {
                logger.info('Deselected device');
                dispatch(closeDevice());
            }}
        />
    );
};
