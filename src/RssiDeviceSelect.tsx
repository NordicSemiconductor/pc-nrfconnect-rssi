/* Copyright (c) 2015 - 2017, Nordic Semiconductor ASA
 *
 * All rights reserved.
 *
 * Use in source and binary forms, redistribution in binary form only, with
 * or without modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions in binary form, except as embedded into a Nordic
 *    Semiconductor ASA integrated circuit in a product or a software update for
 *    such product, must reproduce the above copyright notice, this list of
 *    conditions and the following disclaimer in the documentation and/or other
 *    materials provided with the distribution.
 *
 * 2. Neither the name of Nordic Semiconductor ASA nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * 3. This software, with or without modification, must only be used with a Nordic
 *    Semiconductor ASA integrated circuit.
 *
 * 4. Any software provided in binary form under this license must not be reverse
 *    engineered, decompiled, modified and/or disassembled.
 *
 * THIS SOFTWARE IS PROVIDED BY NORDIC SEMICONDUCTOR ASA "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY, NONINFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL NORDIC SEMICONDUCTOR ASA OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
 * TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Device,
    DeviceSelector,
    getAppFile,
    logger,
} from 'pc-nrfconnect-shared';

import {
    clearRssiData,
    portClosed,
    portOpened,
    receiveRssiData,
} from './actions';
import { startReading, stopReading } from './serialport';
import { getDelay, getScanRepeat } from './reducer';

const deviceListing = {
    nordicUsb: true,
    serialport: true,
    jlink: true,
};
const deviceSetup = {
    dfu: {
        pca10059: {
            application: getAppFile('fw/rssi-10059.hex'),
            semver: 'rssi_cdc_acm 2.0.0+dfuMay-22-2018-10-43-22',
        },
    },
    jprog: {
        nrf52: {
            fw: getAppFile('fw/rssi-10040.hex'),
            fwVersion: 'rssi-fw-1.0.0',
            fwIdAddress: 0x2000,
        },
    },
    needSerialport: true,
};

const logSelectedDevice = (device: Device) => {
    logger.info(
        `Validating firmware for device with s/n ${device.serialNumber}`
    );
};

export default () => {
    const dispatch = useDispatch();
    const delay = useSelector(getDelay);
    const scanRepeat = useSelector(getScanRepeat);

    const startReadingFromDevice = (device: Device) => {
        logger.info(`Opening device with s/n ${device.serialNumber}`);
        dispatch(portClosed());
        dispatch(clearRssiData());

        stopReading().then(() => {
            if (device.serialport == null) {
                logger.error(`Missing serial port information`);
                return;
            }

            startReading(
                device.serialport,
                delay,
                scanRepeat,
                portName => dispatch(portOpened(portName)),
                data => dispatch(receiveRssiData(data))
            );
        });
    };

    const stopReadingFromDevice = () => {
        logger.info('Deselecting device');

        stopReading().then(() => {
            dispatch(portClosed());
            dispatch(clearRssiData());
        });
    };

    return (
        <DeviceSelector
            deviceListing={deviceListing}
            deviceSetup={deviceSetup}
            onDeviceSelected={logSelectedDevice}
            onDeviceIsReady={startReadingFromDevice}
            onDeviceDeselected={stopReadingFromDevice}
        />
    );
};
