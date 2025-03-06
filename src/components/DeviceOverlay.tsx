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

import { DeviceOverlayProps } from "../utils/types";

const DeviceOverlay = ({devices}: DeviceOverlayProps) => {

    const isActive = (device:any) => device.active;

    const generate = (lvl: any) => {
        const components:any = [];
        const l = Math.floor(100*lvl*1.1);
        const NUM = 30;

        for (let i=0; i<NUM; i++) {
            const active = l > (100 / NUM)*i;
            const r = <div className={'circle ' + (active ? 'circle--active' : '') } key={i}></div>
            components.push(r);
        }

        // components.push(<div key={'lvl'} style={{alignSelf: "flex-end"}}>{lvl}</div>)

        return (
            <div className={'circle-container'}>{components}</div>
        )
    }


    return (
        <div className={'deviceOverlay'}>
                <div key={'mic'} className={'text'} > Erkannte Mikrofone: </div>
                {devices.map((device:any) => {
                    return (
                        <div key={`lvl-${device.deviceId}`} className={'deviceOverlay__item ' + (isActive(device) ? 'deviceOverlay__item--active' : '')}>
                            <div key={'text'} className={'deviceOverlay__item__text'}>{`${device.label}`}</div>
                            {generate(device.lvl)}
                        </div>
                    )
                })}
        </div>
    );
}

export default DeviceOverlay;