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

import { logger } from 'pc-nrfconnect-devdep';
import SerialPort from 'serialport';

let port = null;

const theRssiData = [];
const theRssiDataMax = [];

function resetRssiData() {
    theRssiData.splice(0);
    theRssiDataMax.splice(0);
    for (let i = 0; i <= 80; i += 1) {
        theRssiData.push([]);
    }
}
resetRssiData();

function serialPortOpenedAction(portName) {
    return {
        type: 'RSSI_SERIAL_OPENED',
        portName,
    };
}

function serialPortClosedAction() {
    return {
        type: 'RSSI_SERIAL_CLOSED',
    };
}

function rssiData() {
    return {
        type: 'RSSI_DATA',
        data: theRssiData.map(scan => scan[0]),
        dataMax: theRssiDataMax,
    };
}

function writeAndDrain(cmd) {
    return new Promise(resolve => {
        if (port) {
            port.write(cmd, () => {
                port.drain(resolve);
            });
        }
    });
}

function startReading() {
    resetRssiData();
    return writeAndDrain('start\r');
}

async function stopReading() {
    await writeAndDrain('stop\r');
    resetRssiData();
}

export function writeDelay() {
    return (dispatch, getState) => writeAndDrain(`set delay ${getState().app.delay}\r`);
}

export function writeScanRepeat() {
    return (dispatch, getState) => writeAndDrain(`set repeat ${getState().app.scanRepeat}\r`);
}

export function changeDelay(delay) { return { type: 'RSSI_CHANGE_DELAY', delay }; }
export function changeMaxScans(maxScans) { return { type: 'RSSI_CHANGE_MAX_SCANS', maxScans }; }
export function changeChannelScanRepeat(scanRepeat) { return { type: 'RSSI_CHANGE_SCAN_REPEAT', scanRepeat }; }
export function cangeAnimationDuration(animationDuration) { return { type: 'RSSI_CHANGE_ANIMATION_DURATION', animationDuration }; }

export function scanAdvertisementChannels(enable) {
    return async () => {
        await writeAndDrain(`scan adv ${enable ? 'true' : 'false'}\r`);
        resetRssiData();
    };
}

export function setSeparateFrequencies(separateFrequencies) { return { type: 'RSSI_SEPARATE_FREQUENCIES', separateFrequencies }; }

export function toggleLED() {
    return () => writeAndDrain('led\r');
}

function openWhenClosed(serialPort) {
    // Prefer to use the serialport 8 property or fall back to the serialport 7 property
    const portPath = serialPort.path || serialPort.comName;

    return (dispatch, getState) => {
        port = new SerialPort(portPath, {
            baudRate: 115200,
        }, () => {
            logger.info(`${portPath} is open`);
            dispatch(serialPortOpenedAction(portPath));

            (async () => {
                await scanAdvertisementChannels(false)();
                await dispatch(writeDelay());
                await dispatch(writeScanRepeat());
                await startReading();
            })();

            let throttleUpdates = false;

            const buf = [];
            port.on('data', data => {
                buf.splice(buf.length, 0, ...data);
                if (buf.length > 246) {
                    buf.splice(0, buf.length - 246);
                }
                while (buf.length > 3) {
                    while (buf.splice(0, 1)[0] !== 0xff);

                    const [ch, d] = buf.splice(0, 2);
                    if (ch !== 0xff && d !== 0xff) {
                        theRssiData[ch].unshift(d);
                        theRssiData[ch].splice(getState().app.maxScans);
                        theRssiDataMax[ch] = Math.min(...(theRssiData[ch]));
                    }
                }

                if (throttleUpdates) { return; }

                throttleUpdates = true;
                requestAnimationFrame(() => {
                    throttleUpdates = false;
                    dispatch(rssiData());
                });
            })
                .on('error', console.log);
        });
    };
}

export function close() {
    return async dispatch => {
        if (port && (typeof (port.isOpen) === 'function' ? port.isOpen() : port.isOpen)) {
            await stopReading();
            await new Promise(resolve => port.close(resolve));
            port = null;
        } else {
            resetRssiData();
        }
        dispatch(rssiData());
        logger.info('Serial port is closed');
        return dispatch(serialPortClosedAction());
    };
}

export function open(serialPort) {
    return dispatch => dispatch(close())
        .then(() => dispatch(openWhenClosed(serialPort)));
}
