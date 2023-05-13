/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { Device, logger, prepareDevice } from 'pc-nrfconnect-shared';
import { TDispatch } from 'pc-nrfconnect-shared/typings/generated/src/state';

import { clearRssiData, portClosed } from './actions';
import { AppState } from './reducer';
import { deviceSetup } from './RssiDeviceSelect';
import { startReading, stopReading } from './serialport';

export const recoverHex =
    (device: Device) =>
    async (dispatch: TDispatch, getState: () => AppState) => {
        dispatch(portClosed());
        await stopReading();

        dispatch(
            prepareDevice(
                device,
                deviceSetup,
                programmedDevice => {
                    const { delay, scanRepeat } = getState().app;

                    logger.info('Start reading again.');
                    dispatch(clearRssiData());
                    startReading(programmedDevice, delay, scanRepeat, dispatch);
                },
                () => {},
                false
            )
        );
    };
