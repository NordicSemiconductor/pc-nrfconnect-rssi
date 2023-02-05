/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

// import { SerialPort as DeviceSerialport } from '@nordicsemiconductor/nrf-device-lib-js';
import { Device, logger } from 'pc-nrfconnect-shared';
import { TDispatch } from 'pc-nrfconnect-shared/typings/generated/src/state';
import { SerialPort } from 'serialport';

import { portOpened, receiveNoRssiData, receiveRssiData } from './actions';

let port: SerialPort | null = null;

const writeAndDrain = async (cmd: string) => {
    if (port) {
        await new Promise(resolve => {
            port?.write(cmd, () => {
                port?.drain(resolve);
            });
        });
    }
};

export const writeDelay = (delay: number) =>
    writeAndDrain(`set delay ${delay}\r`);

export const writeScanRepeat = (scanRepeat: number) =>
    writeAndDrain(`set repeat ${scanRepeat}\r`);

export const toggleLED = () => writeAndDrain('led\r');

export const resumeReading = async (delay: number, scanRepeat: number) => {
    await writeDelay(delay);
    await writeScanRepeat(scanRepeat);

    await writeAndDrain('start\r');
};

export const pauseReading = () => writeAndDrain('stop\r');

let startedReading: NodeJS.Timeout;
let dataReceived = false;

export const startReading = (
    device: Device,
    delay: number,
    scanRepeat: number,
    dispatch: TDispatch
) => {
    const comName = device.serialport?.comName ?? '';
    port = new SerialPort({ path: comName, baudRate: 115200 }, () => {
        dataReceived = false;
        startedReading = setTimeout(() => {
            if (!dataReceived && device.readbackProtection === 'protected') {
                dispatch(receiveNoRssiData);
            }
        }, 3000);
        logger.info(`${comName} is open`);

        dispatch(portOpened(comName));

        resumeReading(delay, scanRepeat);

        port?.on('data', data => {
            dataReceived = true;
            dispatch(receiveRssiData(data));
        });
        port?.on('error', console.log);
    });
};

export const stopReading = async () => {
    if (startedReading) {
        clearTimeout(startedReading);
    }

    if (port?.isOpen) {
        await pauseReading();
        await new Promise(resolve => {
            port?.close(resolve);
        });
        port = null;
    }
    logger.info('Serial port is closed');
};
