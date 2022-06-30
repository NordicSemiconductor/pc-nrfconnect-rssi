/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useHotKey } from 'pc-nrfconnect-shared';

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
        <div className="control-buttons">
            <Button
                title="alt+r"
                variant="secondary"
                disabled={!isConnected}
                onClick={() => {
                    dispatch(clearRssiData());
                }}
            >
                Reset
            </Button>
            <Button
                title="alt+t"
                variant="secondary"
                disabled={!isConnected}
                onClick={togglePause}
            >
                {isPaused ? 'Start' : 'Pause'}
            </Button>
        </div>
    );
};
