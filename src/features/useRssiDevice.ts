/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppThunk, logger } from 'pc-nrfconnect-shared';

import { createRssiDevice } from './rssiDevice';
import {
    clearRssiData,
    getSerialPort,
    onReceiveNoRssiData,
    onReceiveRssiData,
    setRssiDevice,
} from './rssiSlice';

export default () => {
    const dispatch = useDispatch();
    const serialPort = useSelector(getSerialPort);

    useEffect(() => {
        if (serialPort) {
            const device = createRssiDevice(serialPort);
            dispatch(setRssiDevice(device));

            dispatch<AppThunk>((_, getState) => {
                device.resumeReading(
                    getState().app.rssi.delay,
                    getState().app.rssi.scanRepeat
                );
            });
            let noDataTimeout: NodeJS.Timeout;
            dispatch<AppThunk>((_, getState) => {
                noDataTimeout = setTimeout(() => {
                    if (getState().device.readbackProtection === 'protected') {
                        dispatch(onReceiveNoRssiData());
                    }
                }, 3000);
            });

            serialPort.on('data', data => {
                clearTimeout(noDataTimeout);
                dispatch(onReceiveRssiData(data));
            });
            serialPort.on('error', console.log);

            serialPort.on('close', () => {
                logger.info(`Serial Port ${serialPort.path} has been closed`);
                dispatch(clearRssiData());
            });

            return () => {
                if (serialPort.isOpen) {
                    device.stopReading();
                    logger.info(`Stop RSSI Device`);
                    serialPort.close();
                    logger.info(`Closing Serial Port ${serialPort.path}`);
                }
            };
        }
    }, [dispatch, serialPort]);
};
