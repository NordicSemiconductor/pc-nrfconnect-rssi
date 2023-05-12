/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, StartStopButton, useHotKey } from 'pc-nrfconnect-shared';

import {
    clearRssiData,
    getDelay,
    getIsConnected,
    getIsPaused,
    getRssiDevice,
    getScanRepeat,
    toggleIsPaused,
} from '../features/rssiSlice';

export default () => {
    const isConnected = useSelector(getIsConnected);
    const isPaused = useSelector(getIsPaused);
    const delay = useSelector(getDelay);
    const scanRepeat = useSelector(getScanRepeat);
    const rssiDevice = useSelector(getRssiDevice);
    const dispatch = useDispatch();

    const togglePause = () => {
        dispatch(toggleIsPaused());

        if (isPaused) {
            rssiDevice?.resumeReading(delay, scanRepeat);
        } else {
            rssiDevice?.pauseReading();
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
