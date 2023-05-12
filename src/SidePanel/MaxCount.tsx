/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { NumberInlineInput, Slider } from 'pc-nrfconnect-shared';

import { getMaxScans, setMaxScans } from '../features/rssiSlice';

const range = { min: 1, max: 100 };
const sliderId = 'max-scans-slider';

export default () => {
    const dispatch = useDispatch();
    const maxScans = useSelector(getMaxScans);

    return (
        <>
            <Form.Label htmlFor={sliderId}>
                Show max for last{' '}
                <NumberInlineInput
                    value={maxScans}
                    range={range}
                    onChange={newMaxScans => dispatch(setMaxScans(newMaxScans))}
                />{' '}
                scans
            </Form.Label>
            <Slider
                id={sliderId}
                values={[maxScans]}
                range={range}
                onChange={[newMaxScans => dispatch(setMaxScans(newMaxScans))]}
            />
        </>
    );
};
