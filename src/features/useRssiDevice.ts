/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../appReducer';
import { createRssiDevice } from '../rssiDevice';
import { TDispatch } from '../thunk';
import {
    clearRssiData,
    closeSerialPort,
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

            dispatch((_: TDispatch, getState: () => RootState) => {
                device.resumeReading(
                    getState().app.rssi.delay,
                    getState().app.rssi.scanRepeat
                );
            });
            let noDataTimeout: NodeJS.Timeout;
            dispatch((_: TDispatch, getState: () => RootState) => {
                noDataTimeout = setTimeout(() => {
                    if (getState().device.readbackProtection === 'protected') {
                        dispatch(onReceiveNoRssiData());
                    }
                }, 3000);
            });

            serialPort?.on('data', data => {
                clearTimeout(noDataTimeout);
                dispatch(onReceiveRssiData(data));
            });
            serialPort?.on('error', console.log);

            serialPort?.on('close', () => {
                dispatch(closeSerialPort());
                dispatch(clearRssiData());
            });

            return () => {
                device.stopReading();
                dispatch(closeSerialPort());
                dispatch(clearRssiData());
            };
        }
    }, [dispatch, serialPort]);
};
