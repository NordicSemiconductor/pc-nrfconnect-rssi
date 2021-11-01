/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useCallback } from 'react';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { NumberInlineInput, Slider } from 'pc-nrfconnect-shared';

import { setDelay as setDelayAction } from '../actions';
import { getDelay } from '../reducer';
import { writeDelay } from '../serialport';

const range = { min: 5, max: 1000 };
const sliderId = 'delay-slider';

export default () => {
    const dispatch = useDispatch();
    const delay = useSelector(getDelay);

    const setAndWriteDelay = useCallback(
        newDelay => {
            dispatch(setDelayAction(newDelay));
            writeDelay(newDelay);
        },
        [dispatch]
    );
    const setDelay = useCallback(
        newDelay => dispatch(setDelayAction(newDelay)),
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
                onChange={[setDelay]}
                onChangeComplete={() => writeDelay(delay)}
            />
        </>
    );
};
