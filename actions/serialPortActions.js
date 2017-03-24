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

let port;
let updateInterval;

let maxScans = 30;
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

function setDelay(delay) {
    port.write(`set delay ${delay}\r`);
}

function setScanRepeatTimes(repeatTimes) {
    port.write(`set repeat ${repeatTimes}\r`);
}

function setMaxScans(scans) {
    maxScans = scans;
}

function startReading() {
    resetRssiData();
    port.write('start\r');
}

function stopReading() {
    port.write('stop\r');
    clearInterval(updateInterval);
    resetRssiData();
}

function scanAdvertisementChannels(enable) {
    port.write(`scan adv ${enable ? 'true' : 'false'}\r`);
    resetRssiData();
}

function toggleLED() {
    port.write('led\r');
}

function open(serialPort) {
    return (dispatch, getState, { SerialPort, logger }) => {
        port = new SerialPort(serialPort.comName, {
            baudRate: 115200,
        }, () => {
            logger.info(`${serialPort.comName} is open`);
            dispatch(serialPortOpenedAction(port));

            scanAdvertisementChannels(false);
            setDelay(10);
            setScanRepeatTimes(1);
            setMaxScans(30);
            startReading();

            clearInterval(updateInterval);
            updateInterval = setInterval(() => {
                dispatch(rssiData());
            }, 30);

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
                        theRssiData[ch].splice(maxScans);
                        theRssiDataMax[ch] = Math.min(...(theRssiData[ch]));
                    }
                }
            });
        });
    };
}

function close() {
    return (dispatch, getState, { logger }) => {
        stopReading();
        dispatch(rssiData());
        port.close(() => {
            logger.info('serial port is closed');
            dispatch(serialPortClosedAction());
        });
    };
}

export default {
    open,
    close,
    setDelay,
    setMaxScans,
    setScanRepeatTimes,
    scanAdvertisementChannels,
    toggleLED,
};
