/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NumberInput } from '@nordicsemiconductor/pc-nrfconnect-shared';

import {
    getAnimationDuration,
    setAnimationDuration,
} from '../../features/rssiDevice/rssiDeviceSlice';

export default () => {
    const dispatch = useDispatch();
    const animationDuration = useSelector(getAnimationDuration);

    return (
        <NumberInput
            minWidth
            range={{ min: 10, max: 1000 }}
            value={animationDuration}
            onChange={newAnimationDuration =>
                dispatch(setAnimationDuration(newAnimationDuration))
            }
            label="Hold values for"
            unit="ms"
            showSlider
        />
    );
};
