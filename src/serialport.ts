/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { logger, Serialport as DeviceSerialport } from 'pc-nrfconnect-shared';
import SerialPort from 'serialport';

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

export const startReading = (
    serialPort: DeviceSerialport,
    delay: number,
    scanRepeat: number,
    onOpened: (portname: string) => void,
    onData: (data: Buffer) => void
) => {
    port = new SerialPort(serialPort.comName, { baudRate: 115200 }, () => {
        logger.info(`${serialPort.comName} is open`);
        onOpened(serialPort.comName);

        resumeReading(delay, scanRepeat);

        port?.on('data', onData);
        port?.on('error', console.log);
    });
};

export const stopReading = async () => {
    if (port?.isOpen) {
        await pauseReading();
        await new Promise(resolve => {
            port?.close(resolve);
        });
        port = null;
    }
    logger.info('Serial port is closed');
};
