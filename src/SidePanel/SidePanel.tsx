/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { Group, SidePanel } from 'pc-nrfconnect-shared';

import useRssiDevice from '../features/useRssiDevice';
import AnimationSpeed from './AnimationSpeed';
import ChannelRange from './ChannelRange';
import ControlButtons from './ControlButtons';
import Delay from './Delay';
import LevelRange from './LevelRange';
import MaxCount from './MaxCount';
import SampleCount from './SampleCount';
import ToggleLed from './ToggleLed';

import './sidepanel.scss';

export default () => {
    useRssiDevice();

    return (
        <SidePanel className="sidepanel">
            <Group heading="Controls">
                <ControlButtons />
            </Group>

            <Group heading="Sweep scan">
                <Delay />
            </Group>

            <Group heading="Channel details">
                <MaxCount />
                <SampleCount />
                <AnimationSpeed />
            </Group>

            <Group heading="Filters">
                <ChannelRange />
                <LevelRange />
            </Group>

            <Group heading="Device">
                <ToggleLed />
            </Group>
        </SidePanel>
    );
};
