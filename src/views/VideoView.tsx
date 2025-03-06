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

import { useState } from "react";
import { Divider, Stack } from "@mui/material";
import {useMediaAllowAccess, useTest} from "../utils/hooks";
import ButtonsGroup from "../components/ButtonsGroup";
import { NavigationRoute, NavigationText } from "../utils/types";
import SelectorButtons from "../components/SelectorButtons";
import JitsiLocalVideoFrame from "../components/JitsiLocalVideoFrame";
import JitsiRemoteVideoFrame from "../components/JitsiRemoteVideoFrame";
import {generateRoomName, useJwt} from "../utils/backendServices";
import JitsiFrameWrapper from "../components/JitsiFrameWrapper";
import ErrorModal from "../components/error-modal/ErrorModal";
import {nextButtonText} from "../utils/config";
import {config} from "../routes/routes";


const VideoView = () => {
    const [ room ] = useState(generateRoomName());
    const [ remoteVisible, setRemoteVisible ] = useState(false);
    const { mediaAllowed, mediaError } = useMediaAllowAccess();

    const { jwt, isLoading: jwtLoading, isError: jwtError } = useJwt(room, mediaAllowed);

    const plan = useTest('video');

    const text : NavigationText  = {
        back : `Test verlassen`,
        next : plan?.next ? nextButtonText[plan.next.id] : nextButtonText.summary
    }

    const navigation : NavigationRoute = {
        next :  plan?.next?.route || config.summary.route
    }

    const onLocalJoin = () => {
        setRemoteVisible(true);
    }

    return (
        <>
            {!mediaAllowed && <ErrorModal error={mediaError}/>}

            <div className={'main-content'}>
                <Stack spacing={5} direction={{ md: 'column', lg: 'row' }} className={'selector'}>
                    <div className={'selector__question'}>
                        Wie gut ist Ihre Verbindung?
                    </div>
                        <SelectorButtons mode={`video`}/>
                </Stack>

                <div className={'content'}>

                    {/*LOCAL*/}

                    <Stack spacing={2} direction={{ md: 'column', lg: 'row' }} className={'content__row'}>

                        <div className={'content__row__item content__row__jitsi'}>
                            <JitsiFrameWrapper jwtLoading={jwtLoading}
                                               jwtError={jwtError}
                                               mediaAllowed={mediaAllowed}
                                               mediaError={mediaError}
                                               visible={true}>
                                <JitsiLocalVideoFrame room={room} jwt={jwt} onJoin={onLocalJoin}/>
                            </JitsiFrameWrapper>
                        </div>

                        <div className={'content__row__item'}>

                            <div className={'video-content'}>
                                <div className={'video-content__header'}>
                                    Ihre Videoansicht
                                </div>

                                <div className={'video-content__header-small'}>
                                    Links sehen Sie Ihr Video mit der aktuell eingestellten Kamera.
                                </div>

                                <div className={'row'}>
                                    <div className={'icon icon--arrow'}>
                                        <img src={'images/video/display-icon.svg'} alt={'display icon'}/>
                                    </div>

                                    <div>Sehen Sie kein Video, wählen Sie eine andere Kamera aus: Klicken Sie auf den kleinen Pfeil rechts über dem Kamerasymbol und klicken dann auf einen Kameranamen.
                                       <p>Sie haben keine Kamera zur Auswahl? Überprüfen Sie Ihre Kameraverbindung.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Stack>

                    {/*REMOTE*/}

                    <Stack spacing={2} direction={{ md: 'column', lg: 'row' }} className={'content__row'}>

                        <div className={'content__row__item content__row__jitsi'}>
                            <JitsiFrameWrapper jwtLoading={jwtLoading}
                                               jwtError={jwtError}
                                               mediaAllowed={mediaAllowed}
                                               mediaError={mediaError}
                                               visible={remoteVisible}>
                                <JitsiRemoteVideoFrame room={room} jwt={jwt}/>
                            </JitsiFrameWrapper>
                        </div>


                        <div className={'content__row__item'}>

                            <div className={'video-content'}>
                                <div className={'video-content__header'}>
                                    Ihr Video auf den Bildschirmen der anderen
                                </div>

                                <div className={'video-content__header-small'}>
                                    So sieht Ihr Videobild für Ihre Konferenzpartner aus.
                                </div>

                                <div className={'row'}>
                                    <div className={'icon'}>
                                        <img src={'images/video/Group 207.svg'} alt={'display icon'}/>
                                    </div>

                                    <div>
                                        Falls das Bild verpixelt oder nicht erkennbar ist, kann es sein,
                                            dass Ihre Internetverbindung zu langsam ist. Rechts unten haben Sie
                                            eine Anzeige der Verbindungsqualität. Ist diese rot, ist Ihre Verbindung
                                            nicht ausreichend. Wird sie gelb dargestellt, leidet das Videobild bei
                                            der Übertragung und reicht möglicherweise auch nicht durchgehend für
                                            eine stabile Verbindung.

                                        <p>Prüfen Sie die folgenden Massnahmen:</p>
                                        <ul>
                                            <li>Bewegen Sie sich näher zu Ihrem Router, wenn Sie WLan nutzen</li>
                                            <li>Starten Sie Ihren Router neu</li>
                                            <li>etc (? Handy-Bluetooth?)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </Stack>

                </div>
                <Divider />
                <ButtonsGroup text={text} navigation={navigation}/>
                <div style={{height : `20px`}}></div>
            </div>
        </>
    );
};

export default VideoView;