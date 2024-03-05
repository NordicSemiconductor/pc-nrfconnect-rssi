/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NumberInput } from '@nordicsemiconductor/pc-nrfconnect-shared';

import {
    getMaxScans,
    setMaxScans,
} from '../../features/rssiDevice/rssiDeviceSlice';

export default () => {
    const dispatch = useDispatch();
    const maxScans = useSelector(getMaxScans);

    return (
        <NumberInput
            showSlider
            minWidth
            range={{ min: 1, max: 100 }}
            value={maxScans}
            onChange={newMaxScans => dispatch(setMaxScans(newMaxScans))}
            label="Show max for last"
            unit="scans"
        />
    );
};
