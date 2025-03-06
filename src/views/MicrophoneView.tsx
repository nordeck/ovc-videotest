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
import {Divider, Stack} from "@mui/material";
import {useMediaAllowAccess, useTest} from "../utils/hooks";
import ButtonsGroup from "../components/ButtonsGroup";
import { NavigationRoute, NavigationText } from "../utils/types";
import SelectorButtons from "../components/SelectorButtons";
import JitsiLocalMicrophoeFrame from "../components/JitsiLocalMicrophoneFrame";
import JitsiRemoteMicrophoneFrame from "../components/JitsiRemoteMicrophoneFrame";
import JitsiFrameWrapper from "../components/JitsiFrameWrapper";
import {generateRoomName, useJwt} from "../utils/backendServices";
import ErrorModal from "../components/error-modal/ErrorModal";
import {nextButtonText} from "../utils/config";
import {config} from "../routes/routes";


const MicrophoneView = () => {
    const [ room ] = useState(generateRoomName());
    const [ remoteVisible, setRemoteVisible ] = useState(false);
    const { mediaAllowed, mediaError } = useMediaAllowAccess();
    const [ remoteTrackName, setRemoteTrackName ] = useState('');

    const { jwt, isLoading: jwtLoading, isError: jwtError } = useJwt(room, mediaAllowed);

    const plan = useTest('mic');

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
                        <SelectorButtons mode={`microphone`}/>
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
                                <JitsiLocalMicrophoeFrame room={room} jwt={jwt} onMicChanged={(d) => setRemoteTrackName(d.label)} onJoin={onLocalJoin}/>
                            </JitsiFrameWrapper>
                        </div>

                        <div className={'content__row__item'}>

                            <div className={'video-content'}>
                                <div className={'video-content__header'}>
                                    Audio: Ihr Mikrofon
                                </div>

                                <div className={'video-content__header-small'}>
                                    Sehen Sie einen grünen Balken, wenn Sie jetzt sprechen?
                                </div>

                                <div className={'row'}>
                                    <div className={'icon icon--arrow'}>
                                        <img src={'images/microphone/microphone-test.svg'} alt={'display icon'}/>
                                    </div>

                                    <div>
                                        Links im Fenster sehen Sie eine Liste der erkannten Mikrofone. 
                                        Das ausgewählte Mikrofon ist schwarz hinterlegt. Wenn Sie im Tonstreifen darunter Ausschläge sehen, 
                                        während Sie sprechen, ist dieses aktiv und funktioniert. Wenn Sie keine Ausschläge sehen, wählen Sie ein anderes Mikrofon.
                                       <p>Wenn Sie bei keinem Mikrofon einen grünen Balken sehen, überprüfen Sie Ihre Mikrofonverbindungen.</p>
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
                                <JitsiRemoteMicrophoneFrame room={room} jwt={jwt} remoteTrackName={remoteTrackName} />
                            </JitsiFrameWrapper>
                        </div>


                        <div className={'content__row__item'}>

                            <div className={'video-content'}>
                                <div className={'video-content__header'}>
                                    So werden Sie gehört
                                </div>

                                <div className={'video-content__header-small'}>
                                    Können Sie sich über Lautsprecher hören, wenn Sie sprechen?
                                </div>

                                <div className={'row'}>
                                    <div className="text-align">
                                        Falls nicht, überprüfen Sie, ob Sie im oberen Feld Ausschläge beim Sprechen sehen. 
                                        Ist dies der Fall, gehen Sie einen Schritt weiter und überprüfen Ihre Lautsprecher, 
                                        und kommen ggf. noch einmal zurück.
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

export default MicrophoneView;