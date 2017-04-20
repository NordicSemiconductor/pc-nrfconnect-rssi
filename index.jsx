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

/* eslint-disable react/prop-types */

import React from 'react';
import Chart from './components/Chart';
import ControlPanel from './components/ControlPanel';
import reduceApp from './reducers/appReducer';
import * as FirmwareActions from './actions/firmwareActions';
import * as RssiActions from './actions/rssiActions';
import './resources/css/index.less';

export default {
    decorateMainView: MainView => (
        props => (
            <MainView>
                <Chart {...props} />
            </MainView>
        )
    ),
    mapMainViewState: (state, props) => ({
        ...props,
        rssi: state.app.rssiData,
        rssiMax: state.app.rssiDataMax,
        animationDuration: state.app.animationDuration,
        showSeparateFrequencies: state.app.showSeparateFrequencies,
    }),
    decorateNavMenu: NavMenu => (
        props => (
            <div className="nav-menu-wrap">
                <NavMenu {...props} />
                RSSI Viewer
            </div>
        )
    ),
    decorateSidePanel: SidePanel => (
        props => (
            <SidePanel>
                <ControlPanel {...props} />
            </SidePanel>
        )
    ),
    mapSidePanelDispatch: (dispatch, props) => ({
        ...props,
        onDelayChange: delay => dispatch(
            RssiActions.setDelay(delay),
        ),
        onMaxScansChange: maxScans => dispatch(
            RssiActions.setMaxScans(maxScans),
        ),
        onChannelScanRepeatChange: scanRepeat => dispatch(
            RssiActions.setScanRepeatTimes(scanRepeat),
        ),
        onAnimationDurationChange: duration => dispatch(
            RssiActions.setAnimationDuration(duration),
        ),
        onScanAdvertisementChannelsChange: isEnabled => dispatch(
            RssiActions.shouldScanAdvertisementChannels(isEnabled),
        ),
        onSeparateFrequenciesChange: isEnabled => dispatch(
            RssiActions.shouldShowSeparateFrequencies(isEnabled),
        ),
        onToggleLED: () => dispatch(RssiActions.toggleLED()),
    }),
    middleware: store => next => action => {
        if (action.type === 'SERIAL_PORT_SELECTED') {
            const { port } = action;
            store.dispatch(FirmwareActions.validateFirmware(port.serialNumber, {
                onValid: () => store.dispatch(RssiActions.open(port)),
                onInvalid: () => store.dispatch({ type: 'FIRMWARE_DIALOG_SHOW', port }),
            }));
        }
        if (action.type === 'SERIAL_PORT_DESELECTED') {
            store.dispatch(RssiActions.close());
        }
        if (action.type === 'FIRMWARE_DIALOG_UPDATE_REQUESTED') {
            const { port } = action;
            store.dispatch(FirmwareActions.programFirmware(port.serialNumber, {
                onSuccess: () => {
                    store.dispatch(RssiActions.open(port));
                    store.dispatch({ type: 'FIRMWARE_DIALOG_HIDE' });
                },
            }));
        }
        next(action);
    },
    reduceApp,
};
