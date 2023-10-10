/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useCallback } from 'react';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import {
    NumberInlineInput,
    Slider,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import {
    getDelay,
    getRssiDevice,
    setDelay,
} from '../../features/rssiDevice/rssiDeviceSlice';

const range = { min: 5, max: 1000 };
const sliderId = 'delay-slider';

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
        <>
            <Form.Label htmlFor={sliderId}>
                Run scan every{' '}
                <NumberInlineInput
                    value={delay}
                    range={range}
                    onChange={setAndWriteDelay}
                />
                &nbsp;ms
            </Form.Label>
            <Slider
                id={sliderId}
                values={[delay]}
                range={range}
                onChange={[newDelay => dispatch(setDelay(newDelay))]}
                onChangeComplete={() => rssiDevice?.writeDelay(delay)}
            />
        </>
    );
};
