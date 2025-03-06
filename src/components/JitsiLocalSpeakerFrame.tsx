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
import {JitsiMicrophoneFrameProps} from "../utils/types";


const JitsiLocalSpeakerFrame = ({ room, onJoin, jwt}: JitsiMicrophoneFrameProps) => {
    const [ node, setNode ] = useState<any>();

    const locVideoOptions = useMemo(() =>  ({
        roomName: room,
        width: '100%',
        height: '100%',
        parentNode: node,
        jwt: jwt,
        configOverwrite: {
            hideConferenceSubject: true,
            prejoinConfig: {
                enabled: false,
            },
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            toolbarButtons: [ `microphone` ],
            toolbarConfig: { 
                alwaysVisible: true
            }
        }
    }), [node, room, jwt]);

    const { isLoading, isError  } = useJitsiLoader({
        options: locVideoOptions,
        onJoin: (api: any) => {
            console.log(`JOINED VIDEO CONFERENCE local ${api._myUserID}`);

            if (onJoin) onJoin();
        },

        onEnd: () => {
            console.log('JITSI END CALLED');
            // setEnd(true)
        }
    });

    return (
        <div>
            <Grid item xs  sx={{backgroundColor: 'grey', width: '100%', position:`relative` }} >
                {isLoading && <h1>Loading</h1>}
                {isError && <h1>Error loading Jitsi Web application.</h1>}
                <div className={'jitsi-iframe'} ref={setNode}></div>
            </Grid>
        </div>
    );
}

export default JitsiLocalSpeakerFrame;