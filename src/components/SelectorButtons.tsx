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

import { SelectorButtonsType } from "../utils/types";

const SelectorButtons = ({ mode } : SelectorButtonsType) => {
    return (
        <div className={'selector__buttons hide-buttons'}>
            <ul>
                <li className={mode === `video` ? `video-active` : `video`}>
                    <span style={mode !== `video` ? { color : `#888888`} : {}}>Video</span>
                </li>
                <li className={mode === `microphone` ? `mic-active` : `mic`}>
                    <span style={mode !== `microphone` ? { color : `#888888`} : {}}>Mikrofon</span>
                </li>
                <li className={mode === `speaker` ? `speaker-active` : `speaker`}>
                    <span style={mode !== `speaker` ? { color : `#888888`} : {}}>Lautsprecher</span>
                </li>
            </ul>
        </div>
    );
}


export default SelectorButtons;