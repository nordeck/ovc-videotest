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

import { Divider, Grid, Stack, Typography } from "@mui/material";
import {useMediaAllowAccess, useTest} from "../utils/hooks";
import ButtonsGroup from "../components/ButtonsGroup";
import ErrorModal from "../components/error-modal/ErrorModal";
import {config as configRoute} from "../routes/routes";
import {getTestPlan} from "../utils/testPlan";

const SettingsView = () => {
    const { mediaAllowed, mediaError } = useMediaAllowAccess();

    const plan = getTestPlan();

    const text = {
        back : `Test verlassen`,
        next : !!plan?.[0] ? `Test starten` : ''
    };

    const navigation = {
        next : plan?.[0].route || configRoute.callback.route,
    }

    
    return (
        <Grid className="settings-page">
            {!mediaAllowed && <ErrorModal error={mediaError}/>}
            <Grid className="main-settings-page">
                <Grid className="title">
                    <Typography>Wie gut ist Ihre Verbindung?</Typography>
                </Grid>
                <Grid className="text">
                    <Typography className="text-bold">Ob Kamera und Mikrofon aktiv sind und Ihre Verbindungsqualität ausreicht, überprüfen Sie hier selbst.</Typography>
                    <Typography className="text-thin">Testen Sie</Typography>
                    <Divider sx={{marginBottom : `35px`}}>
                        <Stack className="test-icon" spacing={1} direction='row'>

                            {plan.map((o,idx) => {
                                return (
                                    <Stack className="test-icon" spacing={1} direction='row' key={`t${idx}`}>
                                        {o.id === 'video' && <img alt="video" src="images/landing/videocam_landing.svg"></img>}
                                        {o.id === 'video' && <Typography>Video</Typography>}

                                        {o.id === 'mic' && <img alt="mic" src="images/landing/mic_landing.svg"></img>}
                                        {o.id === 'mic' && <Typography>Mikrofon</Typography>}

                                        {o.id === 'speaker' && <img alt="mic" src="images/landing/mic_landing.svg"></img>}
                                        {o.id === 'speaker' && <Typography>Lautsprecher</Typography>}

                                        {(idx < plan.length - 1) && <Divider></Divider>}
                                    </Stack>
                                );
                            })}
                        </Stack>
                    </Divider>
                    <Typography className="text-bold">Für einen vollständigen Test, müssen Sie der Nutzung von Kamera und Mikrofon zustimmen. Dazu klicken Sie je nach Browser auf „zulassen“ oder „erlauben“. </Typography>
                </Grid>

                <Divider className="divider" variant="middle" sx={{marginTop : `15px`}}/>
                <ButtonsGroup text={text} navigation={navigation} />

                <Grid className="img-set">
                    <figure>
                        <img className="img-border" src="images/landing/google-chrome.png" alt="google-chrome"/>
                        <img className="arrow1" src="images/landing/arrow.svg" alt="arrow"/>
                        <figcaption> Google Chrome </figcaption>
                    </figure>
                    <figure>
                        <img src="images/landing/safari.png" alt="safari"/>
                        <img className="arrow2" src="images/landing/arrow.svg" alt="arrow"/>
                        <figcaption> Apple Safari </figcaption>
                    </figure>
                    <figure>
                        <img className="img-border" src="images/landing/mozilla-firefox.png" alt="mozilla-firefox"/>
                        <img className="arrow3" src="images/landing/arrow.svg" alt="arrow"/>
                        <figcaption> Mozilla FireFox </figcaption>
                    </figure>
                </Grid>
                <Grid>
                    <Typography className="text-thin">Die beim Test entstehenden Aufnahmen sind nur an Ihrem Rechner zu sehen und werden nicht gespeichert.</Typography>
                </Grid>

                <Grid className="footer"></Grid>
            </Grid>
        </Grid>
    )
}


export default SettingsView;