/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { logger } from 'pc-nrfconnect-shared';
import { SerialPort } from 'serialport';

let serialPort: SerialPort | null = null;

export const portIsOpen = () => serialPort?.isOpen;

const closePortPromisified = () =>
    new Promise(resolve => {
        serialPort?.close(resolve);
    });

export const closePort = async () => {
    if (serialPort?.isOpen) {
        await stopReading();
        logger.info(`Stop RSSI Device`);
        await closePortPromisified();
        logger.info(`Closing Serial Port ${serialPort?.path}`);
        serialPort = null;
    }
};

export const openPortPromisifed = (comPort: string) =>
    new Promise<SerialPort>((resolve, reject) => {
        const port = new SerialPort(
            { path: comPort, baudRate: 115200 },
            error => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(port);
            }
        );
    });

export const openPort = async (comPort: string) => {
    await closePort();
    serialPort = await openPortPromisifed(comPort);
};

export const registerCallbacks = ({
    onDataReceived,
    onNoDataReceived,
    onClose,
}: {
    onDataReceived: (data: Buffer) => void;
    onNoDataReceived: () => void;
    onClose: () => void;
}) => {
    const noDataTimeout = setTimeout(() => {
        onNoDataReceived();
    }, 3000);

    serialPort?.on('data', data => {
        clearTimeout(noDataTimeout);
        onDataReceived(data);
    });

    serialPort?.on('error', console.log);

    serialPort?.on('close', () => {
        logger.info(`Serial Port ${serialPort?.path} has been closed`);
        onClose();
    });
};

const writeAndDrain = async (cmd: string) => {
    if (serialPort != null) {
        await new Promise(resolve => {
            serialPort?.write(cmd, () => {
                serialPort?.drain(resolve);
            });
        });
    }
};

export const writeDelay = (delay: number) =>
    writeAndDrain(`set delay ${delay}\r`);

export const writeScanRepeat = (scanRepeat: number) =>
    writeAndDrain(`set repeat ${scanRepeat}\r`);

export const pauseReading = () => writeAndDrain('stop\r');

export const stopReading = async () => {
    await pauseReading();
};

export const resumeReading = async (delay: number, scanRepeat: number) => {
    await writeDelay(delay);
    await writeScanRepeat(scanRepeat);
    await writeAndDrain('start\r');
};

export const toggleLED = () => writeAndDrain('led\r');
