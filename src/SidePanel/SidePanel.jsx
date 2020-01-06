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
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import {
    changeAnimationDuration,
    changeChannelScanRepeat,
    changeDelay,
    changeMaxScans,
    scanAdvertisementChannels,
    setSeparateFrequencies,
    toggleLED,
    writeDelay,
    writeScanRepeat,
} from '../actions';

import Slider from './Slider';

import 'react-rangeslider/lib/index.css';
import './index.scss';

const SidePanel = () => {
    const dispatch = useDispatch();
    const {
        animationDuration,
        delay,
        maxScans,
        port,
        scanRepeat,
    } = useSelector(state => state.app);
    const disabled = port === null;

    return (
        <Form>
            <Form.Label>Sweep Delay (ms)</Form.Label>
            <Slider
                value={delay}
                min={5}
                max={1000}
                onChange={changeDelay}
                onChangeComplete={writeDelay}
            />

            <Form.Label># of sweeps to display maximum value</Form.Label>
            <Slider
                value={maxScans}
                min={1}
                max={100}
                onChange={changeMaxScans}
            />

            <Form.Label>Channel scan repeat</Form.Label>
            <Slider
                value={scanRepeat}
                min={1}
                max={100}
                onChange={changeChannelScanRepeat}
                onChangeComplete={writeScanRepeat}
            />

            <Form.Label>Animation duration (ms)</Form.Label>
            <Slider
                value={animationDuration}
                min={10}
                max={1000}
                onChange={changeAnimationDuration}
            />

            <Form.Group controlId="advCheck">
                <Form.Check
                    disabled={disabled}
                    onChange={event => scanAdvertisementChannels(event.target.checked)}
                    type="checkbox"
                    label="Advertisements only"
                />
            </Form.Group>

            <Form.Group controlId="freqCheck">
                <Form.Check
                    disabled={disabled}
                    onChange={event => dispatch(setSeparateFrequencies(event.target.checked))}
                    type="checkbox"
                    label="Separate Frequencies"
                />
            </Form.Group>

            <Button disabled={disabled} onClick={toggleLED}>Toggle LED</Button>
        </Form>
    );
};

export default SidePanel;
