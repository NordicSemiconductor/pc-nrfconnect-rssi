/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useCallback } from 'react';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { NumberInlineInput, Slider } from 'pc-nrfconnect-shared';

import {
    getRssiDevice,
    getScanRepeat,
    setScanRepeat,
} from '../../features/device/deviceSlice';

const range = { min: 1, max: 100 };
const sliderId = 'sample-count-slider';

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
        <>
            <Form.Label htmlFor={sliderId}>
                Sample each channel{' '}
                <NumberInlineInput
                    value={scanRepeat}
                    range={range}
                    onChange={setAndWriteScanRepeat}
                />{' '}
                times
            </Form.Label>
            <Slider
                id={sliderId}
                values={[scanRepeat]}
                range={range}
                onChange={[
                    newScanRepeat => dispatch(setScanRepeat(newScanRepeat)),
                ]}
                onChangeComplete={() => rssiDevice?.writeScanRepeat(scanRepeat)}
            />
        </>
    );
};
