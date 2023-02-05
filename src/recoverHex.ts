/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import {
    deviceControlRecover,
    firmwareProgram,
} from '@nordicsemiconductor/nrf-device-lib-js';
import {
    describeError,
    Device,
    getDeviceLibContext,
    logger,
} from 'pc-nrfconnect-shared';

import { deviceSetup } from './RssiDeviceSelect';
import { stopReading } from './serialport';

export const recoverHex = (device: Device) => async () => {
    logger.info('Stop reading serialport');
    stopReading();
    logger.info('Recovering device');
    const context = getDeviceLibContext();
    await deviceControlRecover(
        context,
        device.id,
        'NRFDL_DEVICE_CORE_APPLICATION'
    );
    logger.info('Programming the device');

    try {
        await new Promise<void>((resolve, reject) => {
            const jprog =
                deviceSetup.jprog![
                    device.jlink?.deviceFamily.toLowerCase() as keyof typeof deviceSetup.jprog
                ];

            if (!jprog)
                throw new Error('Found no firmware for the selected device');

            firmwareProgram(
                context,
                device.id,
                'NRFDL_FW_FILE',
                'NRFDL_FW_INTEL_HEX',
                jprog.fw,
                error => {
                    if (error) {
                        logger.error(`Programming failed: ${error.message}`);
                        reject(new Error(error.message));
                    } else {
                        logger.info('Successfully programmed the device');
                        resolve();
                    }
                },
                () => {},
                undefined,
                'NRFDL_DEVICE_CORE_APPLICATION'
            );
        });
    } catch (error) {
        logger.error(describeError(error));
    }
};
