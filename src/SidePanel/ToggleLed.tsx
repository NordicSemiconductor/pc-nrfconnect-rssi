/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import Button from 'react-bootstrap/Button';
import { useSelector } from 'react-redux';

import { getIsConnected } from '../reducer';
import { toggleLED } from '../serialport';

export default () => {
    const isConnected = useSelector(getIsConnected);

    return (
        <Button variant="secondary" disabled={!isConnected} onClick={toggleLED}>
            Toggle LED
        </Button>
    );
};
