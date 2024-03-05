/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NumberInput } from '@nordicsemiconductor/pc-nrfconnect-shared';

import {
    getDelay,
    getRssiDevice,
    setDelay,
} from '../../features/rssiDevice/rssiDeviceSlice';

export default () => {
    const dispatch = useDispatch();
    const delay = useSelector(getDelay);
    const rssiDevice = useSelector(getRssiDevice);

    const setAndWriteDelay = useCallback(
        newDelay => {
            dispatch(setDelay(newDelay));
            rssiDevice?.writeDelay(newDelay);
        },
        [dispatch, rssiDevice]
    );

    return (
        <NumberInput
            showSlider
            minWidth
            range={{ min: 5, max: 1000 }}
            value={delay}
            onChange={setAndWriteDelay}
            label="Run scan every"
            unit="ms"
        />
    );
};
