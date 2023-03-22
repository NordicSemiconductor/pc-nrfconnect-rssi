/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import {
    deviceControlRecover,
    deviceControlReset,
    firmwareProgram,
} from '@nordicsemiconductor/nrf-device-lib-js';
import {
    describeError,
    Device,
    getDeviceLibContext,
    logger,
    updateHasReadbackProtection,
} from 'pc-nrfconnect-shared';
import { TDispatch } from 'pc-nrfconnect-shared/typings/generated/src/state';

import { clearRssiData, portClosed } from './actions';
import { AppState } from './reducer';
import { deviceSetup } from './RssiDeviceSelect';
import { startReading, stopReading } from './serialport';

export const recoverHex =
    (device: Device) =>
    async (dispatch: TDispatch, getState: () => AppState) => {
        logger.info('Stop reading serialport');
        dispatch(portClosed());
        await stopReading();

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
                    deviceSetup.jprog?.[
                        device.jlink?.deviceFamily.toLowerCase() as keyof typeof deviceSetup.jprog
                    ];

                if (!jprog)
                    throw new Error(
                        'Found no firmware for the selected device'
                    );

                firmwareProgram(
                    context,
                    device.id,
                    'NRFDL_FW_FILE',
                    'NRFDL_FW_INTEL_HEX',
                    jprog.fw,
                    error => {
                        if (error) {
                            logger.error(
                                `Programming failed: ${error.message}`
                            );
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

            logger.info('Reseting device');
            await deviceControlReset(context, device.id);
            await dispatch(updateHasReadbackProtection());

            const { delay, scanRepeat } = getState().app;

            logger.info('Start reading again.');
            dispatch(clearRssiData());
            startReading(device, delay, scanRepeat, dispatch);
        } catch (error) {
            logger.error(describeError(error));
        }
    };
