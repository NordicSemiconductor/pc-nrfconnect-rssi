/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'pc-nrfconnect-shared';

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
            {!isPaused && isConnected ? (
                <Button
                    title="alt+t"
                    className="w-100 start-stop active-anim"
                    disabled={!isConnected}
                    onClick={togglePause}
                >
                    <span className="mdi mdi-stop-circle" />
                    Pause
                </Button>
            ) : (
                <Button
                    title="alt+t"
                    className="start-stop"
                    disabled={!isConnected}
                    onClick={togglePause}
                >
                    <span className="mdi mdi-play-circle" />
                    Start
                </Button>
            )}

            <Button
                title="alt+r"
                className="reset-btn"
                disabled={!isConnected}
                onClick={() => {
                    dispatch(clearRssiData());
                }}
            >
                Reset
            </Button>
        </div>
    );
};
