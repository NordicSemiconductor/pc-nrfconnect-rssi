/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { Button, selectedDevice } from 'pc-nrfconnect-shared';

import { toggleLED } from '../../features/device/rssiDevice';

export default () => {
    const isConnected = useSelector(selectedDevice) != null;

    return (
        <Button
            variant="secondary"
            className="w-100"
            disabled={!isConnected}
            onClick={() => toggleLED()}
        >
            Toggle LED
        </Button>
    );
};
