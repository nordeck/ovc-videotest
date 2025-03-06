/*
 * Copyright 2025 Nordeck IT + Consulting GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { RemoteDeviceOverlayProps } from "../utils/types";

const RemoteDeviceOverlay = ({activeMic, lvl}: RemoteDeviceOverlayProps) => {

    const generate = (lvl: any) => {
        const components:any = [];
        const l = Math.floor(100*lvl*2);
        const NUM = 18;

        if (lvl<0) return '';

        for (let i=0; i<NUM; i++) {
            const active = l > (100 / NUM)*i;
            const r = <div className={'circle ' + (active ? 'circle--active' : '') } key={i}></div>
            components.push(r);
        }

        return (
            <div className={'circle-container'}>{components}</div>
        )
    }


    return (
        <div className={'remoteDeviceOverlay'}>
            <div className={'remoteDeviceOverlay__smallText'}>Ausgewähltes Mikrofon:</div>

            {activeMic && <div className={'remoteDeviceOverlay__row'}>
                <div className={'remoteDeviceOverlay__micName'}>{activeMic}</div>
                <div className={'remoteDeviceOverlay__lvl'}>{generate(lvl)}</div>
            </div>}

        </div>
    );
}

export default RemoteDeviceOverlay;