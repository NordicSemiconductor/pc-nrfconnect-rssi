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

import EventEmitter from 'events';

class RssiAdapter extends EventEmitter {
    constructor(port) {
        super();
        this.port = port;
        this.maxScans = 30;
    }

    start() {
        this.setScanAdvertisementChannels(false);
        this.setDelay(10);
        this.setScanRepeatTimes(1);
        this.port.write('start\r');

        const rssiData = [];
        const rssiDataMax = [];
        for (let i = 0; i <= 80; i += 1) {
            rssiData.push([]);
        }

        const buf = [];
        this.port.on('data', data => {
            buf.splice(buf.length, 0, ...data);
            if (buf.length > 246) {
                buf.splice(0, buf.length - 246);
            }
            while (buf.length > 3) {
                while (buf.splice(0, 1)[0] !== 0xff);

                const [ch, d] = buf.splice(0, 2);
                if (ch !== 0xff && d !== 0xff) {
                    rssiData[ch].unshift(d);
                    rssiData[ch].splice(this.maxScans);
                    rssiDataMax[ch] = Math.min(...rssiData[ch]);
                }
            }
        });

        this.updateInterval = setInterval(() => {
            this.emit('data', {
                rssiData,
                rssiDataMax,
            });
        }, 30);
    }

    setDelay(delay) {
        this.port.write(`set delay ${delay}\r`);
    }

    setScanRepeatTimes(repeatTimes) {
        this.port.write(`set repeat ${repeatTimes}\r`);
    }

    setMaxScans(maxScans) {
        this.maxScans = maxScans;
    }

    setScanAdvertisementChannels(enable) {
        this.port.write(`scan adv ${enable ? 'true' : 'false'}\r`);
    }

    toggleLED() {
        this.port.write('led\r');
    }

    close(callback) {
        clearInterval(this.updateInterval);
        this.port.close(callback);
    }
}

let adapter;

function serialPortClosed() {
    return {
        type: 'RSSI_SERIAL_CLOSED',
    };
}

export function rssiDataReceived(rssiData, rssiDataMax) {
    return {
        type: 'RSSI_DATA_RECEIVED',
        rssiData: rssiData.map(scan => scan[0]),
        rssiDataMax,
    };
}

export function shouldShowSeparateFrequencies(isEnabled) {
    return (dispatch, getState, { logger }) => {
        if (isEnabled) {
            logger.info('Showing separarate frequencies');
        } else {
            logger.info('Showing line graph');
        }
        dispatch({
            type: 'RSSI_SEPARATE_FREQUENCIES_CHANGED',
            isEnabled,
        });
    };
}

export function setAnimationDuration(duration) {
    return (dispatch, getState, { logger }) => {
        logger.info(`Setting animation duration to ${duration} ms`);
        dispatch({
            type: 'RSSI_ANIMATION_DURATION_CHANGED',
            duration,
        });
    };
}

export function setDelay(delay) {
    return (dispatch, getState, { logger }) => {
        logger.info(`Setting sweep delay to ${delay} ms`);
        adapter.setDelay(delay);
    };
}

export function setScanRepeatTimes(repeatTimes) {
    return (dispatch, getState, { logger }) => {
        logger.info(`Setting channel scan repeat to ${repeatTimes}`);
        adapter.setScanRepeatTimes(repeatTimes);
    };
}

export function setMaxScans(maxScans) {
    return (dispatch, getState, { logger }) => {
        logger.info(`Setting max scans to ${maxScans}`);
        adapter.setMaxScans(maxScans);
    };
}

export function shouldScanAdvertisementChannels(isEnabled) {
    return (dispatch, getState, { logger }) => {
        if (isEnabled) {
            logger.info('Scanning advertisement channels only');
        } else {
            logger.info('Scanning all channels');
        }
        adapter.setScanAdvertisementChannels(isEnabled);
    };
}

export function toggleLED() {
    return (dispatch, getState, { logger }) => {
        logger.info('Toggling LED');
        adapter.toggleLED();
    };
}

export function open(serialPort) {
    return (dispatch, getState, { SerialPort, logger }) => {
        const options = { baudRate: 115200 };
        const port = new SerialPort(serialPort.comName, options, () => {
            logger.info(`${serialPort.comName} is open`);
            adapter = new RssiAdapter(port);
            adapter.on('data', data => {
                dispatch(rssiDataReceived(data.rssiData, data.rssiDataMax));
            });
            adapter.start();
        });
    };
}

export function close() {
    return (dispatch, getState, { logger }) => {
        if (adapter) {
            adapter.close(() => {
                adapter = null;
                logger.info('Serial port is closed');
                dispatch(serialPortClosed());
            });
        }
    };
}
