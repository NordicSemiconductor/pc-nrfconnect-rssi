/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'pc-nrfconnect-shared';

import { getIsConnected } from '../reducer';
import { toggleLED } from '../serialport';

export default () => {
    const isConnected = useSelector(getIsConnected);

    return (
        <Button
            className="w-100 h-24"
            disabled={!isConnected}
            onClick={toggleLED}
        >
            Toggle LED
        </Button>
    );
};
