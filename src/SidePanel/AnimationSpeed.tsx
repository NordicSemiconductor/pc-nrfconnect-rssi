/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { NumberInlineInput, Slider } from 'pc-nrfconnect-shared';

import {
    getAnimationDuration,
    setAnimationDuration,
} from '../features/rssiSlice';

const range = { min: 10, max: 1000 };
const sliderId = 'animation-duration-slider';

export default () => {
    const dispatch = useDispatch();
    const animationDuration = useSelector(getAnimationDuration);

    return (
        <>
            <Form.Label htmlFor={sliderId}>
                Hold values for{' '}
                <NumberInlineInput
                    value={animationDuration}
                    range={range}
                    onChange={newAnimationDuration =>
                        dispatch(setAnimationDuration(newAnimationDuration))
                    }
                />
                &nbsp;ms
            </Form.Label>
            <Slider
                id={sliderId}
                values={[animationDuration]}
                range={range}
                onChange={[
                    newAnimationDuration =>
                        dispatch(setAnimationDuration(newAnimationDuration)),
                ]}
            />
        </>
    );
};
