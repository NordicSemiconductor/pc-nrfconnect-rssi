/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, StartStopButton, useHotKey } from 'pc-nrfconnect-shared';

import { clearRssiData, togglePause as togglePauseAction } from '../actions';
import {
    getDelay,
    getIsConnected,
    getIsPaused,
    getScanRepeat,
} from '../reducer';
import { pauseReading, resumeReading } from '../serialport';

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

    useHotKey({
        hotKey: 'alt+r',
        title: 'Reset',
        isGlobal: false,
        action: () => dispatch(clearRssiData()),
    });

    useHotKey(
        {
            hotKey: 'alt+t',
            title: 'Start/Pause',
            isGlobal: false,
            action: () => togglePause(),
        },
        [isPaused]
    );

    return (
        <>
            <StartStopButton
                startText="Start"
                stopText="Pause"
                started={!isPaused && isConnected}
                onClick={togglePause}
                disabled={!isConnected}
            />

            <Button
                variant="secondary"
                className="w-100"
                title="alt+r"
                disabled={!isConnected}
                onClick={() => {
                    dispatch(clearRssiData());
                }}
            >
                Reset
            </Button>
        </>
    );
};
