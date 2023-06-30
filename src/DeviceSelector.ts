/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { connect } from 'react-redux';
import { DeviceTraits } from '@nordicsemiconductor/nrf-device-lib-js';
import {
    AppDispatch,
    Device,
    DeviceSelector,
    logger,
} from 'pc-nrfconnect-shared';

import {
    closeDevice,
    deviceSetupConfig,
    openDevice,
} from './actions/deviceActions';

/**
 * Configures which device types to show in the device selector.
 * The config format is described on
 * https://github.com/NordicSemiconductor/nrf-device-lister-js.
 */
const deviceListing: DeviceTraits = {
    nordicUsb: true,
    serialPorts: true,
    jlink: true,
    nordicDfu: true,
};

const mapState = () => ({
    deviceListing,
    deviceSetupConfig,
});

/*
 * In these callbacks you may react on events when users (de)selected a device.
 * Leave out callbacks you do not need.
 *
 * Note that the callbacks releaseCurrentDevice and onDeviceIsReady
 * are only invoked, if a deviceSetup is defined.
 */
const mapDispatch = (dispatch: AppDispatch) => ({
    onDeviceSelected: (device: Device) => {
        logger.info(`Selected device with s/n ${device.serialNumber}`);
    },
    onDeviceDeselected: () => {
        logger.info('Deselected device');
        dispatch(closeDevice());
    },
    onDeviceIsReady: (device: Device) => {
        logger.info(`Device isReady SN:${device.serialNumber}`);
        dispatch(openDevice(device));
    },

    onDeviceConnected: (device: Device) => {
        logger.info(`Device Connected SN:${device.serialNumber}`);
    },

    onDeviceDisconnected: (device: Device) => {
        logger.info(`Device Disconnected SN:${device.serialNumber}`);
    },
});

export default connect(mapState, mapDispatch)(DeviceSelector);
