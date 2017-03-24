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

/* eslint react/prop-types: 0 */

import React from 'react';
import Chart from './components/Chart';
import ControlPanel from './components/ControlPanel';
import reduceApp from './reducers/appReducer';
import SerialPortActions from './actions/serialPortActions';
import './resources/css/index.less';

const yRange = {
    min: -110,
    max: -20,
    map: y => -(yRange.min + yRange.max) - y,
};

export default {
    config: {
        firmwarePaths: {
            nrf52: './firmware/pca10040/blank/arm5_no_packs/_build/nrf52832_xxaa.hex',
        },
    },
    decorateMainView: MainView => (
        props => (
            <MainView>
                <Chart {...props} yMin={yRange.min} yMax={yRange.max} />
            </MainView>
        )
    ),
    mapMainViewState: (state, props) => ({
        ...props,
        rssi: state.app.data.map(yRange.map),
        rssiMax: state.app.dataMax.map(yRange.map),
        animationDuration: state.app.animationDuration,
        separateFrequencies: state.app.separateFrequencies,
    }),
    decorateNavMenu: NavMenu => (
        props => (
            <div className="nav-menu-wrap">
                <NavMenu {...props} />
                RSSI Measurer
            </div>
        )
    ),
    decorateSidePanel: SidePanel => (
        props => (
            <SidePanel>
                <ControlPanel
                    onDelayChange={props.onDelayChange}
                    onMaxScansChange={props.onMaxScansChange}
                    onChannelScanRepeatChange={props.onChannelScanRepeatChange}
                    onAnimationDurationChange={props.onAnimationDurationChange}
                    onScanAdvertisementsToggle={props.onScanAdvertisementsToggle}
                    onSeparateFrequencies={props.onSeparateFrequencies}
                    onToggleLED={props.onToggleLED}
                />
            </SidePanel>
        )
    ),
    mapSidePanelDispatch: (dispatch, props) => ({
        ...props,
        onDelayChange: delay => dispatch(SerialPortActions.setDelay(delay)),
        onMaxScansChange: maxScans => dispatch(SerialPortActions.setMaxScans(maxScans)),
        onChannelScanRepeatChange: scanRepeat => dispatch(
            SerialPortActions.setScanRepeatTimes(scanRepeat)),
        onAnimationDurationChange: animationDuration => dispatch({
            type: 'RSSI_CHANGE_ANIMATION_DURATION',
            animationDuration,
        }),
        onScanAdvertisementsToggle: scanAdvertisementChannels => dispatch(
            SerialPortActions.scanAdvertisementChannels(scanAdvertisementChannels)),
        onSeparateFrequencies: separateFrequencies => dispatch({
            type: 'RSSI_SEPARATE_FREQUENCIES',
            separateFrequencies,
        }),
        onToggleLED: () => dispatch(SerialPortActions.toggleLED()),
    }),
    middleware: store => next => action => {
        if (!action) {
            return;
        }
        if (action.type === 'SERIAL_PORT_SELECTED') {
            store.dispatch(SerialPortActions.open(action.port));
        }
        if (action.type === 'SERIAL_PORT_DESELECTED') {
            store.dispatch(SerialPortActions.close());
        }
        next(action);
    },
    reduceApp,
};
