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

import { useEffect, useRef } from "react";
import { useStableCallback } from "./hooks";
import { useQuery } from "react-query";
import { JitsiOpts } from "./types"
import config from "./config";


export function useJitsiExternalApiLoader() {
    // react-query will make sure that the script is added to the DOM only once
    const loader = async (url: string) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.async = true;
            script.src = url;
            script.type = "text/javascript";
            script.onload = () => {
                console.log('SCRIPT ADDED');
                resolve('loaded');
            };
            script.onerror = (e) => {
                reject(e);
            }

            document.body.appendChild(script);
        });
    }

    const { isLoading, isError, error, isSuccess: scriptLoaded  } = useQuery<any, Error>(
        ['jitsi-external-api'],
        () => loader(`https://${config.jitsiFQDN}/external_api.js`),
        {
            enabled: true,
            retry: false,
            refetchOnWindowFocus: false,
            retryOnMount: false,
            staleTime: Infinity,
            cacheTime: Infinity
        }
    );

    return  {
        isLoading,
        isError,
        error,
        scriptLoaded
    };
}

export function useJitsiLoader({options, onJoin, onEnd}: JitsiOpts) {
    const isMounted = useRef<boolean>(false);
    const onEndStable = useStableCallback(onEnd);
    const onJoinStable = useStableCallback(onJoin);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false
        }
    }, []);

    const { isLoading, isError, error, scriptLoaded  } = useJitsiExternalApiLoader();

    useEffect(() => {
        if (!scriptLoaded) return;
        if (!isMounted.current) return;
        if (!options?.roomName) return;

        const api = new (window as any).JitsiMeetExternalAPI(config.jitsiFQDN, options);

        console.log('JITSI SETUP');

        // when Jitsi Meet is ready to be closed (i.e., hangup operations are completed).
        api.addListener("readyToClose", onEndStable);

        // when the local user has left the video conference.
        api.addListener("videoConferenceLeft", onEndStable);

        // auto hide filmstrip
        api.addListener('filmstripDisplayChanged', (e:any) => {
            if (e.visible) api.executeCommand('toggleFilmStrip');
        });

        api.addListener("videoConferenceJoined", () => {
            onJoinStable(api);
        });

        return () => {
            console.log('JITSI API DISPOSED!')
            api.dispose();
        }
    }, [scriptLoaded, options, onEndStable, onJoinStable]);

    return { isLoading, isError, error };
}

export const getAPP = (api:any) => api.getIFrame().contentWindow.APP;
export const getState = (api:any) => getAPP(api).store.getState();
export const getJitsiMeetJS = (api:any) => api.getIFrame().contentWindow.JitsiMeetJS;

export function isPluginRequired(api: any) {
    try {
        getAPP(api);
    } catch (e) {
        return true;
    }
    return false;
}

export async function getAudioInputDeviceData(api:any) {
    if (!getState(api)['features/base/devices'].availableDevices.audioInput) return [];
    const microphoneDevices =  getState(api)['features/base/devices'].availableDevices.audioInput.map(
        ({ deviceId, label }: {deviceId:string, label:string}) => {
            return {
                deviceId,
                label
            };
        });
    const newAudioTracks = await createLocalAudioTracks(api, microphoneDevices, 5000);
    return newAudioTracks;
}

export  function createLocalTrack(api:any, type:string, deviceId:string, timeout:number, additionalOptions?:any) {
    return (
        getJitsiMeetJS(api).createLocalTracks({
            cameraDeviceId: deviceId,
            devices: [ type ],
            //firefox_fake_device:
            //    window.config?.firefox_fake_device,
            micDeviceId: deviceId,
            timeout,
            ...additionalOptions
        }).then(([ jitsiLocalTrack ]: any[]) => jitsiLocalTrack));
}

export function createLocalAudioTracks(api:any, devices:{deviceId:string, label:string}[], timeout:any) {
    return Promise.all(
        devices.map(async ({ deviceId, label }) => {
            let jitsiTrack = null;
            let hasError = false;

            try {
                jitsiTrack = await createLocalTrack(api, 'audio', deviceId, timeout);
            } catch (err) {
                console.log(err);
                hasError = true;
            }

            return {
                deviceId,
                hasError,
                jitsiTrack,
                label
            };
        }));
}

export  function getCurrentMicDeviceId(state:any) {
    return getDeviceIdByType(state, 'isAudioTrack');
}

export  function getDeviceIdByType(state:any, isType:string):string {
    const [ deviceId ] = state['features/base/tracks']
        .map((t:any) => t.jitsiTrack)
        .filter((t:any) => t && t?.isLocal() && t[isType]())
        .map((t:any) => t.getDeviceId());
    return deviceId || '';
}

// returns cleanup fn
export const registerLvlListener = (api:any,
                                    onMessage:(o:{data:any, origin:string})=>void,
                                    device: any,
                                    type: string):()=>void => {
    const {deviceId, jitsiTrack, label, local, participantId} = device;

    if (!jitsiTrack) {
        console.error('no track');
        return () => {};
    }

    const lvlChange = (lvl:number) => {
        const isActive = (deviceId:string) => {
            return deviceId === getCurrentMicDeviceId(getState(api));
        }

        const payload = {
            type,
            mode: 'local',
            deviceId,
            label,
            lvl,
            local,
            participantId,
            active: isActive(deviceId)
        };

        onMessage({
            data: payload,
            origin: `https://${config.jitsiFQDN}`
        });
    };

    jitsiTrack.on('track.audioLevelsChanged', lvlChange);
    return () => jitsiTrack.off('track.audioLevelsChanged', lvlChange);
}