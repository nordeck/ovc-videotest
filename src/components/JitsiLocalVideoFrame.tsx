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
import { useJitsiLoader } from "../utils/jitsiUtils";
import {useMemo, useState} from "react";
import { JitsiVideoFrameProps } from "../utils/types";


const JitsiLocalVideoFrame = ({room, jwt, onJoin}: JitsiVideoFrameProps) => {
    const [node, setNode] = useState<any>();

    const locVideoOptions = useMemo(() =>  ({
        roomName: room,
        width: '100%',
        height: '100%',
        parentNode: node,
        jwt: jwt,
        configOverwrite: {
            connectionIndicators: {
                autoHide: false,
            },
            disableLocalVideoFlip: true,
            disableSelfViewSettings: true,
            disableTileView: false,
            disableInviteFunctions: true,
            disableModeratorIndicator: true,
            disableProfile: true,
            disableRemoteMute: true,
            disableShortcuts: true,
            hiddenDomain: 'meet.jitsi', // TODO: meaning?
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
                numberOfVisibleTiles: 1
            },
            toolbarButtons: [ 'camera' ],
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

            function switchToTileView(e:any, api:any) {
                if (!e.enabled) api.executeCommand('setTileView', true);
            }

            function closeFilmStrip(e:any, api:any) {
                if (e.visible) api.executeCommand('toggleFilmStrip');
            }

            api.addListener('filmstripDisplayChanged', (e:any) => closeFilmStrip(e, api));
            api.addListener('tileViewChanged', (e:any) => switchToTileView(e, api));
            api.executeCommand('setTileView', true);

            if (onJoin) onJoin();
        },

        onEnd: () => {
            console.log('JITSI END CALLED');
            // setEnd(true)
        }
    });

    return (
        <div>
            <Grid item xs  sx={{backgroundColor: 'grey', width: '100%'}} >
                {isLoading && <h1>Loading</h1>}
                {isError && <h1>Error loading Jitsi Web application.</h1>}
                <div className={'jitsi-iframe'} ref={setNode}></div>
            </Grid>
        </div>
    );
}

export default JitsiLocalVideoFrame;