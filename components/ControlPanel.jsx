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
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

const ControlPanel = props => {
    const {
        delay,
        scanRepeat,
        maxScans,
        animationDuration,
        writeDelay,
        writeScanRepeat,
        onDelayChange,
        onMaxScansChange,
        onChannelScanRepeatChange,
        onAnimationDurationChange,
        onScanAdvertisementsToggle,
        onSeparateFrequencies,
        onToggleLED,
        disabled,
    } = props;
    return (
        <Form>
            <Form.Label>Sweep Delay (ms)</Form.Label>
            <Slider
                value={delay}
                title={delay}
                max={1000}
                min={5}
                onChangeComplete={writeDelay}
                onChange={value => onDelayChange(value)}
                labels={{ 5: '5', [delay]: `${delay}`, 1000: '1000' }}
                tooltip={false}
            />
            <Form.Label># of sweeps to display maximum value</Form.Label>
            <Slider
                value={maxScans}
                max={100}
                min={1}
                onChange={value => onMaxScansChange(value)}
                labels={{ 1: '1', [maxScans]: `${maxScans}`, 100: '100' }}
                tooltip={false}
            />
            <Form.Label>Channel scan repeat</Form.Label>
            <Slider
                value={scanRepeat}
                max={100}
                min={1}
                onChangeComplete={writeScanRepeat}
                onChange={value => onChannelScanRepeatChange(value)}
                labels={{ 1: '1', [scanRepeat]: `${scanRepeat}`, 100: '100' }}
                tooltip={false}
            />
            <Form.Label>Animation duration (ms)</Form.Label>
            <Slider
                value={animationDuration}
                max={1000}
                min={10}
                onChange={value => onAnimationDurationChange(value)}
                labels={{ 10: '10', [animationDuration]: `${animationDuration}`, 1000: '1000' }}
                tooltip={false}
            />
            <Form.Group controlId="advCheck">
                <Form.Check
                    disabled={disabled}
                    onChange={event => onScanAdvertisementsToggle(event.target.checked)}
                    type="checkbox"
                    label="Advertisements only"
                />
            </Form.Group>
            <Form.Group controlId="freqCheck">
                <Form.Check
                    disabled={disabled}
                    onChange={event => onSeparateFrequencies(event.target.checked)}
                    type="checkbox"
                    label="Separate Frequencies"
                />
            </Form.Group>
            <Button disabled={disabled} onClick={onToggleLED}>Toggle LED</Button>
        </Form>
    );
};

ControlPanel.propTypes = {
    delay: PropTypes.number.isRequired,
    scanRepeat: PropTypes.number.isRequired,
    maxScans: PropTypes.number.isRequired,
    animationDuration: PropTypes.number.isRequired,
    writeDelay: PropTypes.func.isRequired,
    writeScanRepeat: PropTypes.func.isRequired,
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
