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

const initialState = {
    data: [],
    dataMax: [],
    delay: 10,
    scanRepeat: 1,
    maxScans: 30,
    animationDuration: 500,
    separateFrequencies: false,
    scanAdvChannelsOnly: false,
    port: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'RSSI_DATA':
            return {
                ...state,
                data: action.data,
                dataMax: action.dataMax,
            };
        case 'RSSI_CHANGE_DELAY':
            return {
                ...state,
                delay: action.delay,
            };
        case 'RSSI_CHANGE_MAX_SCANS':
            return {
                ...state,
                maxScans: action.maxScans,
            };
        case 'RSSI_CHANGE_SCAN_REPEAT':
            return {
                ...state,
                scanRepeat: action.scanRepeat,
            };
        case 'RSSI_CHANGE_ANIMATION_DURATION':
            return {
                ...state,
                animationDuration: action.animationDuration,
            };
        case 'RSSI_SEPARATE_FREQUENCIES':
            return {
                ...state,
                separateFrequencies: action.separateFrequencies,
            };
        case 'RSSI_SCAN_ADV_CHANNELS_ONLY':
            return {
                ...state,
                scanAdvChannelsOnly: action.scanAdvChannelsOnly,
            };
        case 'RSSI_SERIAL_OPENED':
            return {
                ...state,
                port: action.portName,
            };
        case 'RSSI_SERIAL_CLOSED':
            return {
                ...state,
                port: null,
            };
        default:
            return state;
    }
};
