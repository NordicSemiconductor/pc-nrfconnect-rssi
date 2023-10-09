/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { SerialPort } from 'serialport';

export type RssiDevice = Awaited<ReturnType<typeof createRssiDevice>>;

export const createRssiDevice = (serialPort: SerialPort) => {
    const writeAndDrain = async (cmd: string) => {
        await new Promise(resolve => {
            serialPort.write(cmd, () => {
                serialPort.drain(resolve);
            });
        });
    };

    const writeDelay = (delay: number) => writeAndDrain(`set delay ${delay}\r`);

    const writeScanRepeat = (scanRepeat: number) =>
        writeAndDrain(`set repeat ${scanRepeat}\r`);

    const pauseReading = () => writeAndDrain('stop\r');

    return {
        pauseReading,
        stopReading: async () => {
            await pauseReading();
        },
        resumeReading: async (delay: number, scanRepeat: number) => {
            await writeDelay(delay);
            await writeScanRepeat(scanRepeat);
            await writeAndDrain('start\r');
        },
        toggleLED: () => writeAndDrain('led\r'),
        writeScanRepeat,
        writeDelay: (delay: number) => writeAndDrain(`set delay ${delay}\r`),
    };
};
