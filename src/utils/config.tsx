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

const getCustomConfig = ():any => ((window as any).customConfig || {});

const config: {
    jitsiFQDN: string,
    jwtEndpointUrl: string,
    roomPrefix: string,
    nodeEnv: string,
    baseName: string,
    jitsiJWT?: string,
    defaultCallbackUrl: string,
    version: string
    allowedCallbackUrls: string
} = {
    "nodeEnv": process.env.NODE_ENV,
    "version": process.env.REACT_APP_VERSION || process.env.NODE_ENV,
    "jitsiFQDN": getCustomConfig().REACT_APP_JITSI_FQDN ||  process.env.REACT_APP_JITSI_FQDN,
    "jwtEndpointUrl": getCustomConfig().REACT_APP_JWT_ENDPOINT_URL || process.env.REACT_APP_JWT_ENDPOINT_URL,
    "roomPrefix": getCustomConfig().REACT_APP_ROOM_PREFIX || process.env.REACT_APP_ROOM_PREFIX || 'videotest',
    "baseName": process.env.REACT_APP_BASENAME || '/',
    "jitsiJWT": process.env.REACT_APP_DEBUG_JITSI_JWT,
    "defaultCallbackUrl": getCustomConfig().REACT_APP_DEFAULT_CALLBACK_URL || process.env.REACT_APP_DEFAULT_CALLBACK_URL || '/',
    "allowedCallbackUrls": getCustomConfig().REACT_APP_ALLOWED_CALLBACK_URLS || process.env.REACT_APP_ALLOWED_CALLBACK_URLS
};

export const  nextButtonText:{[key: string]: string} = {
    video: 'weiter zum Videotest',
    mic: 'weiter zum Mikrofontest',
    speaker:`weiter zum Lautsprechertest`,
    summary: 'Test beenden'
}



export default config;