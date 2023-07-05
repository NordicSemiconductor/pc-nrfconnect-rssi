/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import {
    AppThunk,
    Device,
    DeviceSetupConfig,
    getAppFile,
    jprogDeviceSetup,
    logger,
    prepareDevice,
    sdfuDeviceSetup,
} from 'pc-nrfconnect-shared';

import {
    clearRssiData,
    getDelay,
    getScanRepeat,
    onReceiveNoRssiData,
    onReceiveRssiData,
    resetRssiStore,
} from './deviceSlice';
import {
    closePort,
    openPort,
    registerCallbacks,
    resumeReading,
} from './rssiDevice';

export const deviceSetupConfig: DeviceSetupConfig = {
    deviceSetups: [
        sdfuDeviceSetup(
            [
                {
                    key: 'pca10059',
                    application: getAppFile('fw/rssi-10059.hex'),
                    semver: 'rssi_cdc_acm 2.0.0+dfuMay-22-2018-10-43-22',
                    params: {},
                },
            ],
            true
        ),
        jprogDeviceSetup(
            [
                {
                    key: 'nrf52_family',
                    fw: getAppFile('fw/rssi-10040.hex'),
                    fwVersion: 'rssi-fw-1.0.0',
                    fwIdAddress: 0x2000,
                },
            ],
            true
        ),
    ],
};

export const openDevice =
    (device: Device): AppThunk =>
    async (dispatch, getState) => {
        // Reset serial port settings
        const ports = device.serialPorts;

        if (ports) {
            const comPort = ports[0].comName; // We want to connect to vComIndex 0
            if (comPort) {
                logger.info(`Opening Serial port ${comPort}`);

                try {
                    await openPort(comPort);

                    logger.info(`Serial Port ${comPort} has been opened`);

                    dispatch(resetRssiStore());

                    resumeReading(
                        getDelay(getState()),
                        getScanRepeat(getState())
                    );

                    registerCallbacks({
                        onDataReceived: data => {
                            dispatch(onReceiveRssiData(data));
                        },
                        onNoDataReceived: () => {
                            dispatch(onReceiveNoRssiData());
                        },
                        onClose: () => {
                            dispatch(clearRssiData());
                        },
                    });
                } catch (error) {
                    logger.error(`Failed to open serial port ${comPort}.`);
                    logger.error(`Error ${error}.`);
                }
            }
        }
    };

export const recoverHex =
    (device: Device): AppThunk =>
    async dispatch => {
        await closePort();
        dispatch(
            prepareDevice(
                device,
                deviceSetupConfig,
                programmedDevice => {
                    dispatch(openDevice(programmedDevice));
                },
                () => {},
                false,
                false
            )
        );
    };
