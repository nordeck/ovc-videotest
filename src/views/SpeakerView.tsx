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

import {useState} from "react";
import {Divider, Grid, Stack } from "@mui/material";
import {useMediaAllowAccess, useTest} from "../utils/hooks";
import ButtonsGroup from "../components/ButtonsGroup";
import {NavigationRoute, NavigationText, TJwt} from "../utils/types";
import SelectorButtons from "../components/SelectorButtons";
import JitsiLocalSpeakerFrame from "../components/JitsiLocalSpeakerFrame";
import {generateRoomName, useJwt} from "../utils/backendServices";
import JitsiFrameWrapper from "../components/JitsiFrameWrapper";
import ErrorModal from "../components/error-modal/ErrorModal";
import {nextButtonText} from "../utils/config";
import {config} from "../routes/routes";

const SpeakerView = () => {
    const [ room ] = useState(generateRoomName());

    const { mediaAllowed, mediaError } = useMediaAllowAccess();
    const { jwt, isLoading, isError } = useJwt(room, mediaAllowed);

    const images = [ 
        { alt : "volume-cross", src: "images/speaker/volume-cross.svg", width: '48px' },
        { alt : "volume-mute", src: "images/speaker/volume-mute.svg", width: '48px' },
        { alt : "volume-off", src: "images/speaker/volume-off.svg", width: '48px' },
        { alt : "volume-down", src: "images/speaker/volume-down.svg", width: '48px' },
        { alt : "red-arrow", src: "images/speaker/red-arrow.svg", width: '48px' },
        { alt : "volume-up", src: "images/speaker/volume-up.svg", width: '48px' },
    ];

    const plan = useTest('speaker');

    const text : NavigationText  = {
        back : `Test verlassen`,
        next : plan?.next ? nextButtonText[plan.next.id] : nextButtonText.summary
    }

    const navigation : NavigationRoute = {
        next :  plan?.next?.route || config.summary.route
    }

    return (
        <>
            {!mediaAllowed && <ErrorModal error={mediaError}/>}
            <div className={'main-content'}>
                <Stack spacing={5} direction={{ md: 'column', lg: 'row' }} className={'selector'}>
                    <div className={'selector__question'}>
                        Wie gut ist Ihre Verbindung?
                    </div>
                    <SelectorButtons mode={`speaker`}/>
                </Stack>
                <div className={'content'}>
                    <Stack spacing={5} direction={{ md: 'column', lg: 'row' }} className={'content__row'}>
                        <div style={{marginBottom : `20px`}} className={'content__row__item content__row__jitsi'}>
                            <JitsiFrameWrapper jwtLoading={isLoading}
                                               jwtError={isError}
                                               mediaAllowed={mediaAllowed}
                                               mediaError={mediaError}
                                               visible={true}>
                                <JitsiLocalSpeakerFrame room={room} jwt={jwt}/>
                            </JitsiFrameWrapper>
                        </div>
                        <div className={'content__row__item'}>
                            <div className={'video-content'}>
                                <div className="row">
                                    <div className={'icon icon--arrow'}>
                                        <img src={'images/microphone/microphone-test.svg'} alt={'display icon'}/>
                                    </div>
                                    <span className='video-content__header-small'>
                                        Um sicherzustellen das Sie Ton hören klicken Sie im Menü Audioausgabe auf den "Test" Link.
                                    </span>
                                </div>
                                <Stack className={'row'}>
                                    <div className="text-align">
                                        Wenn Sie nichts hören, schauen Sie, ob Ihre Lautsprecher stumm oder sehr leise gestellt sind, 
                                        und ändern Sie die Einstellung, bis der Testklang gut bei Ihnen ankommt. 
                                        Möglicherweise sehen Ihre Tasten / Knöpfe dafür so aus:
                                        <Grid container className="image-set">
                                            {images.map((image) => <Grid display="flex" key={image.src} item><img src={image.src} alt={image.alt} width={image.width}></img></Grid>)}
                                        </Grid>
                                    </div>
                                </Stack>
                                <div className="row">
                                    <div className={'icon icon--arrow'}>
                                        <img src={'images/microphone/microphone-test.svg'} alt={'display icon'}/>
                                    </div>
                                        Hilft dieses nicht, klicken Sie auf den kleinen Pfeil neben „Audioausgabe” 
                                        und wählen Sie Ihre Lautsprecher aus. Spielen Sie dann zur 
                                        Überprüfung noch einmal einen Testklang ab.
                                </div>
                            </div>
                        </div>
                    </Stack>
                </div>
                <div style={{marginTop : `155px`}}>
                    <Divider />
                    <ButtonsGroup text={text} navigation={navigation}/>
                </div>
            </div>
        </>
    );
};


export default SpeakerView;