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
    getState,
    isPluginRequired,
    registerLvlListener,
    useJitsiLoader
} from "../utils/jitsiUtils";
import {useEffect, useMemo, useState} from "react";
import { useStableCallback } from "../utils/hooks";
import RemoteDeviceOverlay from "./RemoteDeviceOverlay";
import { JitsiMicrophoneFrameProps } from "../utils/types";
import config from "../utils/config";


const JitsiRemoteMicrophoneFrame = ({ room, jwt, remoteTrackName, onJoin}: JitsiMicrophoneFrameProps) => {
    const [ node, setNode ] = useState<any>();
    const [ remoteLvl, setRemoteLvl ] = useState(-1);

    //  handler for IFRAME messages using window.addEventListener
    const onMessage = useStableCallback(_onMessage);

    function  _onMessage(event:any) {
        const {data} = event || {};
        if (!data) return;
        if (data.type !== 'track' ) return;

        if (event.origin !== `https://${config.jitsiFQDN}`) {
            console.error(`Event origin ${event.origin}, is not https://${config.jitsiFQDN}`);
            return
        }

        if (data.local === false) {
            setRemoteLvl(data.lvl);
        }
    }

    useEffect(() => {
        window.addEventListener('message', onMessage);
        return () => window.removeEventListener('message', onMessage);
    }, [onMessage]);

    const remVideoOptions = useMemo(() =>  ({
        roomName: room,
        width: '100%',
        height: '100%',
        parentNode: node,
        jwt: jwt,
        configOverwrite: {
            connectionIndicators: {
                autoHide: false,
            },
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
            startWithVideoMuted: true,
            tileView: {
                disabled: true,
            },
            toolbarButtons: [],
        },
        interfaceConfigOverwrite: {
            DISABLE_VIDEO_BACKGROUND: true,
            VERTICAL_FILMSTRIP: true,
        },
    }), [node, room, jwt]);

    const { isLoading, isError  } = useJitsiLoader({
        options: remVideoOptions,
        onJoin: (api: any) => {
            console.log(`JOINED VIDEO CONFERENCE remove ${api._myUserID}`);

            const usingPlugin = isPluginRequired(api);
            console.warn('[remote] ' + (usingPlugin ? 'JITSI PLUGIN' : 'NO JITSI PLUGIN'));

            const remoteUserId = api._myUserID;
            api.getRoomsInfo().then(({rooms}:any) => {
                const mainRoom = rooms.find((r:any) => r.isMainRoom);
                const localUserId = mainRoom.participants.find((p:any) => p.id !== remoteUserId);
                api.pinParticipant(localUserId);
            });

            if (usingPlugin) {
                const iframe = api.getIFrame();
                iframe.contentWindow.postMessage({type: 'videotest', mode : 'remote'}, iframe.src);
            } else {
                // no plugin
                getAPP(api).conference.muteAudio(true);
                getAPP(api).conference.muteVideo(true);

                const setupTrackListener = (iteration=0) => {
                    if (iteration > 10) return;
                    const tracks = getState(api)['features/base/tracks'];
                    const audioTracks = tracks.filter((t:any) => t.mediaType === 'audio');

                    console.warn('tracks', audioTracks);

                    // keep trying until there's a track
                    if (audioTracks.length < 1) {
                        setTimeout(() => setupTrackListener(iteration+1), 5000);
                        return;
                    }

                    const levelAudioTracks = audioTracks.map((audioTrack:any, i:number) => {
                        const { jitsiTrack } = audioTrack;
                        return {
                            deviceId: i,
                            local: audioTrack.local,
                            participantId: audioTrack.participantId,
                            jitsiTrack,
                            label: `[track ${i}] ${audioTrack.local ? 'Local' : 'Remote'}  track of participant [${audioTrack.participantId}]`
                        };
                    });
                    levelAudioTracks.forEach((track:any) => registerLvlListener(api, onMessage, track, 'track'));
                };

                setupTrackListener();
            }

            if (onJoin) onJoin();
        },

        onEnd: () => {
            console.log('JITSI END CALLED');
        }
    });

    return (
        <div>
            <RemoteDeviceOverlay activeMic={remoteTrackName} lvl={remoteLvl}/>

            <Grid item xs  sx={{backgroundColor: 'grey', width: '100%'}} >
                {isLoading && <h1>Loading</h1>}
                {isError && <h1>Error loading Jitsi Web application.</h1>}
                <div className={'jitsi-iframe'} ref={setNode}></div>
            </Grid>
        </div>
    );
}

export default JitsiRemoteMicrophoneFrame;