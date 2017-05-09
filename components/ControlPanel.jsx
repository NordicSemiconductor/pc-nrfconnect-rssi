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

import React, { PropTypes } from 'react';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import { Checkbox, Button } from 'react-bootstrap';

const ControlPanel = props => {
    const {
        onDelayChange,
        onMaxScansChange,
        onChannelScanRepeatChange,
        onAnimationDurationChange,
        onScanAdvertisementsToggle,
        onSeparateFrequencies,
        onToggleLED,
        disabled,
    } = props;
    const sliderDisabled = disabled ? 'disabled' : null;
    return (
        <div >
            Sweep Delay (ms)<br />
            <ReactBootstrapSlider
                value={10}
                slideStop={event => onDelayChange(event.target.value)}
                max={1000}
                min={5}
                ticks={[5, 1000]}
                ticks_labels={['5', '1000']}
                disabled={sliderDisabled}
            />
            # of sweeps to display maximum value
            <ReactBootstrapSlider
                value={30}
                slideStop={event => onMaxScansChange(event.target.value)}
                max={100}
                min={1}
                ticks={[1, 100]}
                ticks_labels={['1', '100']}
                disabled={sliderDisabled}
            />
            Channel scan repeat
            <ReactBootstrapSlider
                value={1}
                slideStop={event => onChannelScanRepeatChange(event.target.value)}
                max={100}
                min={1}
                ticks={[1, 100]}
                ticks_labels={['1', '100']}
                disabled={sliderDisabled}
            />
            Animation duration (ms)
            <ReactBootstrapSlider
                value={500}
                slideStop={event => onAnimationDurationChange(event.target.value)}
                max={1000}
                min={10}
                ticks={[10, 1000]}
                ticks_labels={['10', '1000']}
                disabled={sliderDisabled}
            />
            <Checkbox
                disabled={disabled}
                onChange={event => onScanAdvertisementsToggle(event.target.checked)}
            >
                Advertisements only
            </Checkbox>
            <Checkbox
                disabled={disabled}
                onChange={event => onSeparateFrequencies(event.target.checked)}
            >
                Separate Frequencies
            </Checkbox>
            <Button disabled={disabled} onClick={onToggleLED}>Toggle LED</Button>
        </div>
    );
};

ControlPanel.propTypes = {
    onDelayChange: PropTypes.func.isRequired,
    onMaxScansChange: PropTypes.func.isRequired,
    onChannelScanRepeatChange: PropTypes.func.isRequired,
    onAnimationDurationChange: PropTypes.func.isRequired,
    onScanAdvertisementsToggle: PropTypes.func.isRequired,
    onSeparateFrequencies: PropTypes.func.isRequired,
    onToggleLED: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
};

export default ControlPanel;
