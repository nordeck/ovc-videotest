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

import { Dispatch } from "react";

export type TMode = 'local' | 'remote';
export type TMessageType = 'videotest';
export type TSelectorMode = 'microphone' | 'video' | 'speaker';

export type NavigationText = {
  back : string,
  next : string
};

export type NavigationRoute = {
  next : string
};

export type ButtonsGroupProps = {
  text : NavigationText,
  navigation : NavigationRoute
}

export type SelectorButtonsType = {
  mode : TSelectorMode,
}

export type JitsiVideoFrameProps = {
  room: string,
  jwt?: string,
  onJoin?: () => void;
}
  
export type JitsiMicrophoneFrameProps = {
  room : string,
  jwt?: string,
  remoteTrackName?: string,
  onMicChanged?: (device:any) => void;
  onJoin?: () => void;
}

export type DeviceOverlayProps = {
  devices: any[],
  activeMic?: string
}

export type TFn = (...args: any[]) => any;

export interface JitsiOpts {
  options: any,
  onJoin: (api: any) => void,
  onEnd: () => void,
}

export type TGlobalContext = {
  state: any,
  updateState: Dispatch<any>;
}

export type RemoteDeviceOverlayProps = {
  lvl: number,
  activeMic: any
}

export type audioDevice = {
  active : boolean,
  deviceId : string,
  label : string,
  lvl : number,
  mode : string,
  type : string,
  local ?: any,
  participantId ?: any
}

export type TJwt = {
  jwt: string
}
