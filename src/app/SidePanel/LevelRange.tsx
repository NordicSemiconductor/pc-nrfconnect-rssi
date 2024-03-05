/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    NumberInlineInput,
    Slider,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import {
    getLevelRange,
    initialLevelRange,
    setLevelRange,
} from '../../features/rssiDevice/rssiDeviceSlice';

const sliderId = 'ble-level-slider';

export default () => {
    const dispatch = useDispatch();
    const levelRange = useSelector(getLevelRange);

    const min = Math.min(...levelRange);
    const max = Math.max(...levelRange);

    const setNewLevelRangeIfUnequal = (value1: number, value2: number) => {
        if (value1 !== value2) {
            dispatch(setLevelRange([value1, value2]));
        }
    };

    return (
        <div className="tw-flex tw-flex-col tw-gap-1">
            <div className="tw-flex tw-flex-row">
                Levels from{' '}
                <NumberInlineInput
                    value={-max}
                    range={{ min: -initialLevelRange.max, max: -min + 1 }}
                    onChange={(newMax: number) =>
                        setNewLevelRangeIfUnequal(min, -newMax)
                    }
                />{' '}
                to{' '}
                <NumberInlineInput
                    value={-min}
                    range={{ min: -max + 1, max: -initialLevelRange.min }}
                    onChange={(newMin: number) =>
                        setNewLevelRangeIfUnequal(-newMin, max)
                    }
                />{' '}
                dBm
            </div>
            <Slider
                id={sliderId}
                values={levelRange.map(v => -v)}
                range={{
                    min: -initialLevelRange.max,
                    max: -initialLevelRange.min,
                }}
                onChange={[
                    newValue =>
                        setNewLevelRangeIfUnequal(-newValue, levelRange[1]),
                    newValue =>
                        setNewLevelRangeIfUnequal(levelRange[0], -newValue),
                ]}
            />
        </div>
    );
};
