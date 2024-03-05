/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NumberInput } from '@nordicsemiconductor/pc-nrfconnect-shared';

import {
    getRssiDevice,
    getScanRepeat,
    setScanRepeat,
} from '../../features/rssiDevice/rssiDeviceSlice';

export default () => {
    const dispatch = useDispatch();
    const scanRepeat = useSelector(getScanRepeat);
    const rssiDevice = useSelector(getRssiDevice);

    const setAndWriteScanRepeat = useCallback(
        newScanRepeat => {
            dispatch(setScanRepeat(newScanRepeat));
            rssiDevice?.writeScanRepeat(newScanRepeat);
        },
        [dispatch, rssiDevice]
    );

    return (
        <NumberInput
            showSlider
            minWidth
            range={{ min: 1, max: 100 }}
            value={scanRepeat}
            onChange={setAndWriteScanRepeat}
            label="Sample each channel"
            unit="times"
        />
    );
};
