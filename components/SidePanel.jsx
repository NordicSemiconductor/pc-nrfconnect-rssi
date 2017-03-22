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
import ReactBootstrapSlider from 'react-bootstrap-slider';
import { Checkbox, Button } from 'react-bootstrap';

export default {
    mapSidePanelState: (state, props) => ({
        ...props,
    }),
    mapSidePanelDispatch: (dispatch, props) => ({
        ...props,
        onDelayChange: sender => dispatch({
            type: 'RSSI_CHANGE_DELAY',
            delay: sender.target.value,
        }),
        onMaxScansChange: sender => dispatch({
            type: 'RSSI_CHANGE_MAX_SCANS',
            maxScans: sender.target.value,
        }),
        onChannelScanRepeatChange: sender => dispatch({
            type: 'RSSI_CHANGE_SCAN_REPEAT_TIMES',
            scanRepeatTimes: sender.target.value,
        }),
        onAnimationDurationChange: sender => dispatch({
            type: 'RSSI_CHANGE_ANIMATION_DURATION',
            animationDuration: sender.target.value,
        }),
        onScanAdvertisementsToggle: sender => dispatch({
            type: 'RSSI_SCAN_ADVERTISEMENTS',
            enable: sender.target.checked,
        }),
        onToggleLed: () => dispatch({
            type: 'RSSI_TOGGLE_LED',
        }),
    }),
    decorateSidePanel: SidePanel => (
        props => (
            <SidePanel {...props}>
                Sweep Delay (ms)<br />
                <ReactBootstrapSlider
                    value={500}
                    slideStop={props.onDelayChange}
                    max={1000}
                    min={5}
                    ticks={[5, 1000]}
                    ticks_labels={['5', '1000']}
                />
                # of sweeps to display maximum value
                <ReactBootstrapSlider
                    value={30}
                    slideStop={props.onMaxScansChange}
                    max={100}
                    min={1}
                    ticks={[1, 100]}
                    ticks_labels={['1', '100']}
                />
                Channel scan repeat
                <ReactBootstrapSlider
                    value={10}
                    slideStop={props.onChannelScanRepeatChange}
                    max={100}
                    min={1}
                    ticks={[1, 100]}
                    ticks_labels={['1', '100']}
                />
                Animation duration (ms)
                <ReactBootstrapSlider
                    value={500}
                    slideStop={props.onAnimationDurationChange}
                    max={1000}
                    min={10}
                    ticks={[10, 1000]}
                    ticks_labels={['10', '1000']}
                />
                <Checkbox onChange={props.onScanAdvertisementsToggle}>
                    Advertisements only
                </Checkbox>
                <Button onClick={props.onToggleLed}>Toggle LED</Button>
            </SidePanel>
        )
    ),
};
