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
} from '@nordicsemiconductor/pc-nrfconnect-shared';
import { SerialPort } from 'serialport';

import { clearSerialPort, setSerialPort } from './rssiDeviceSlice';

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
            true,
            true
        ),
    ],
};

export const closeDevice = (): AppThunk => dispatch => {
    dispatch(clearSerialPort());
};

export const openDevice =
    (device: Device): AppThunk =>
    dispatch => {
        // Reset serial port settings
        const ports = device.serialPorts;

        if (ports) {
            const comPort = ports[0].comName; // We want to connect to vComIndex 0
            if (comPort) {
                logger.info(`Opening Serial port ${comPort}`);
                const serialPort = new SerialPort(
                    { path: comPort, baudRate: 115200 },
                    error => {
                        if (error) {
                            logger.error(
                                `Failed to open serial port ${comPort}.`
                            );
                            logger.error(`Error ${error}.`);
                            return;
                        }

                        dispatch(setSerialPort(serialPort));
                        logger.info(`Serial Port ${comPort} has been opened`);
                    }
                );
            }
        }
    };

export const recoverHex =
    (device: Device): AppThunk =>
    (dispatch, getState) => {
        getState().app.rssi.serialPort?.close(() => {
            dispatch(clearSerialPort());
            dispatch(
                prepareDevice(
                    device,
                    deviceSetupConfig,
                    programmedDevice => {
                        dispatch(openDevice(programmedDevice));
                    },
                    () => {},
                    undefined,
                    false,
                    false
                )
            );
        });
    };
