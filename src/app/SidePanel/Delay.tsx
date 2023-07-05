/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useCallback } from 'react';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { NumberInlineInput, Slider } from 'pc-nrfconnect-shared';

import { getDelay, setDelay } from '../../features/device/deviceSlice';
import { writeDelay } from '../../features/device/rssiDevice';

const range = { min: 5, max: 1000 };
const sliderId = 'delay-slider';

export default () => {
    const dispatch = useDispatch();
    const delay = useSelector(getDelay);

    const setAndWriteDelay = useCallback(
        newDelay => {
            dispatch(setDelay(newDelay));
            writeDelay(newDelay);
        },
        [dispatch]
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
                onChangeComplete={() => writeDelay(delay)}
            />
        </>
    );
};
