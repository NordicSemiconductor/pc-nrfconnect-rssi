/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'pc-nrfconnect-shared';

import {
    getIsConnected,
    getRssiDevice,
} from '../../features/device/deviceSlice';

export default () => {
    const isConnected = useSelector(getIsConnected);
    const rssiDevice = useSelector(getRssiDevice);

    return (
        <Button
            variant="secondary"
            className="w-100"
            disabled={!isConnected}
            onClick={() => rssiDevice?.toggleLED()}
        >
            Toggle LED
        </Button>
    );
};
