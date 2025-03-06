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

import { Grid } from "@mui/material";
import {
    getAPP,
    getAudioInputDeviceData,
    isPluginRequired,
    registerLvlListener,
    useJitsiLoader
} from "../utils/jitsiUtils";
import {useEffect, useMemo, useRef, useState} from "react";
import { useStableCallback } from "../utils/hooks";
import DeviceOverlay from "./DeviceOverlay";
import { JitsiMicrophoneFrameProps, audioDevice } from "../utils/types";
import config from "../utils/config";

const JitsiLocalMicrophoneFrame = ({ room, onMicChanged, onJoin, jwt}: JitsiMicrophoneFrameProps) => {
    const activeMicRef = useRef<any>();

    const [ node, setNode ] = useState<any>();
    const [ audioDevices, setAudioDevices ] = useState<any>([]);

    //  handler for IFRAME messages using window.addEventListener
    const onMessage = useStableCallback(_onMessage);

    function  _onMessage(event:any) {
        const {data} = event || {};
        if (!data) return;
        if (data.type !== 'device' ) return;

        if (event.origin !== `https://${config.jitsiFQDN}`) {
            console.error(`Event origin ${event.origin}, is not https://${config.jitsiFQDN}`);
            return;
        }

        const {deviceId, active} = data;
        const found = audioDevices.find((a:any) => a?.deviceId === deviceId);
        const sortDevices = (device1 : audioDevice, device2 : audioDevice) => device1.label.localeCompare(device2.label);

        if (active && activeMicRef.current?.deviceId !== deviceId) {
            if (onMicChanged) onMicChanged(data);
        }

        if (found) {
            found.lvl = data.lvl;
            found.active = data.active;
            setAudioDevices([...audioDevices]);
        } else {
            setAudioDevices([...audioDevices, data].sort(sortDevices));
        }
    }

    useEffect(() => {
        window.addEventListener('message', onMessage);
        return () => window.removeEventListener('message', onMessage);
    }, [onMessage]);

    const locVideoOptions = useMemo(() =>  ({
        roomName: room,
        width: '100%',
        height: '100%',
        parentNode: node,
        jwt: jwt,
        configOverwrite: {
            disableInviteFunctions: true,
            disableModeratorIndicator: true,
            disableProfile: true,
            disableRemoteMute: true,
            disableShortcuts: true,
            disableTileView: true,
            doNotStoreRoom: true,
            enableInsecureRoomNameWarning: false,
            filmstrip: {
                disableResizable: true,
                disableStageFilmstrip: true,
                disableTopPanel: true,
            },
            hideConferenceSubject: true,
            hideConferenceTimer: true,
            hideDisplayName: true,
            hideParticipantsStats: true,
            notifications: [],
            p2p:   {
                enabled: false,
            },
            prejoinConfig: {
                enabled: false,
            },
            remoteVideoMenu: {
                disabled: true,
            },
            requireDisplayName: false,
            startWithAudioMuted: true,
            startWithVideoMuted: false,
            tileView: {
                disabled: false,
            },
            toolbarButtons: [ 'microphone' ],
            toolbarConfig: { alwaysVisible: true },
        },
        interfaceConfigOverwrite: {
            DISABLE_VIDEO_BACKGROUND: true,
            JITSI_WATERMARK_LINK: 'about',
            VERTICAL_FILMSTRIP: false,
        },
    }), [node, room, jwt]);


    const { isLoading, isError  } = useJitsiLoader({
        options: locVideoOptions,

        onJoin: (api: any) => {
            console.log(`JOINED VIDEO CONFERENCE local ${api._myUserID}`);

            const usingPlugin = isPluginRequired(api);
            console.warn('[local] ' + (usingPlugin ? 'JITSI PLUGIN' : 'NO JITSI PLUGIN'));

            const iframe = api.getIFrame();
            api.pinParticipant(api._myUserID);

            if (usingPlugin) {
                iframe.contentWindow.postMessage({type: 'videotest', mode : 'local'}, iframe.src);
            } else {
                // no plugin
                getAPP(api).conference.muteAudio(false);
                getAPP(api).conference.muteVideo(false);

                getAudioInputDeviceData(api).then(devices => {
                    devices.forEach(d => {
                        console.warn(d);
                        registerLvlListener(api, onMessage, {...d, label: d.label}, 'device');
                    });
                }).catch((e) => console.error(`can't get local mic devices`, e));
            }

            if (onJoin) onJoin();
        },

        onEnd: () => {
            console.log('JITSI END CALLED');
        }
    });

    return (
        <div>
            <DeviceOverlay devices={audioDevices}/>

            <Grid item xs width={{xs : `200px`}}  sx={{backgroundColor: 'grey', width: '100%'}} >
                {isLoading && <h1>Loading</h1>}
                {isError && <h1>Error loading Jitsi Web application.</h1>}
                <div className={'jitsi-iframe'} ref={setNode}></div>
            </Grid>
        </div>
    );
}

export default JitsiLocalMicrophoneFrame;