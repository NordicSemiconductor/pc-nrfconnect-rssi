/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import {
    Device,
    DeviceSetup,
    getAppFile,
    jprogDeviceSetup,
    logger,
    prepareDevice,
    sdfuDeviceSetup,
} from 'pc-nrfconnect-shared';
import { SerialPort } from 'serialport';

import {
    clearSerialPort,
    setAvailableSerialPorts,
    setSelectedSerialport,
    setSerialPort,
} from '../features/rssiSlice';
import { TAction } from '../thunk';

export const deviceSetup: DeviceSetup = {
    deviceSetups: [
        sdfuDeviceSetup([
            {
                key: 'pca10059',
                application: getAppFile('fw/rssi-10059.hex'),
                semver: 'rssi_cdc_acm 2.0.0+dfuMay-22-2018-10-43-22',
                params: {},
            },
        ]),
        jprogDeviceSetup([
            {
                key: 'nrf52_family',
                fw: getAppFile('fw/rssi-10040.hex'),
                fwVersion: 'rssi-fw-1.0.0',
                fwIdAddress: 0x2000,
            },
        ]),
    ],
    needSerialport: true,
};

export const closeDevice = (): TAction => dispatch => {
    dispatch(clearSerialPort());
    dispatch(setAvailableSerialPorts([]));
};

export const openDevice =
    (device: Device): TAction =>
    dispatch => {
        // Reset serial port settings
        const ports = device.serialPorts;

        if (ports) {
            if (ports?.length > 0) {
                dispatch(
                    setAvailableSerialPorts(
                        ports.map(port => port.comName ?? '')
                    )
                );
            }

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

                        dispatch(setSelectedSerialport(comPort));
                        dispatch(setSerialPort(serialPort));
                        logger.info(`Serial Port ${comPort} has been opened`);
                    }
                );
            }
        }
    };

export const recoverHex =
    (device: Device): TAction =>
    (dispatch, getState) => {
        getState().app.rssi.serialPort?.close(() => {
            dispatch(clearSerialPort());
            dispatch(
                prepareDevice(
                    device,
                    deviceSetup,
                    programmedDevice => {
                        dispatch(openDevice(programmedDevice));
                    },
                    () => {},
                    false,
                    false
                )
            );
        });
    };
