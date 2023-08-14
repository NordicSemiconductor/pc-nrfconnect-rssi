/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import {
    bleChannels,
    NumberInlineInput,
    Slider,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { getChannelRange, setChannelRange } from '../features/rssiSlice';

const sliderId = 'ble-channel-slider';

export default () => {
    const dispatch = useDispatch();
    const channelRange = useSelector(getChannelRange);

    const min = Math.min(...channelRange);
    const max = Math.max(...channelRange);

    return (
        <>
            <Form.Label htmlFor={sliderId}>
                Channels from{' '}
                <NumberInlineInput
                    value={min}
                    range={{ min: bleChannels.min, max }}
                    onChange={(newMin: number) =>
                        dispatch(setChannelRange([newMin, max]))
                    }
                />{' '}
                to{' '}
                <NumberInlineInput
                    value={max}
                    range={{ min, max: bleChannels.max }}
                    onChange={(newMax: number) =>
                        dispatch(setChannelRange([min, newMax]))
                    }
                />
            </Form.Label>
            <Slider
                id={sliderId}
                values={channelRange}
                range={{ min: bleChannels.min, max: bleChannels.max }}
                onChange={[
                    newValue =>
                        dispatch(setChannelRange([newValue, channelRange[1]])),
                    newValue =>
                        dispatch(setChannelRange([channelRange[0], newValue])),
                ]}
            />
        </>
    );
};
