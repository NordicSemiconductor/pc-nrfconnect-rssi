/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';

import { clearRssiData, togglePause as togglePauseAction } from '../actions';
import {
    getDelay,
    getIsConnected,
    getIsPaused,
    getScanRepeat,
} from '../reducer';
import { pauseReading, resumeReading } from '../serialport';

import './control-buttons.scss';

export default () => {
    const isConnected = useSelector(getIsConnected);
    const isPaused = useSelector(getIsPaused);
    const delay = useSelector(getDelay);
    const scanRepeat = useSelector(getScanRepeat);
    const dispatch = useDispatch();

    const togglePause = () => {
        dispatch(togglePauseAction());

        if (isPaused) {
            resumeReading(delay, scanRepeat);
        } else {
            pauseReading();
        }
    };
    return (
        <div className="control-buttons">
            <Button
                variant="secondary"
                disabled={!isConnected}
                onClick={() => {
                    dispatch(clearRssiData());
                }}
            >
                Reset
            </Button>
            <Button
                variant="secondary"
                disabled={!isConnected}
                onClick={togglePause}
            >
                {isPaused ? 'Start' : 'Pause'}
            </Button>
        </div>
    );
};
