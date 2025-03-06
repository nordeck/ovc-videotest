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

import { Divider, Grid, Typography, Stack, Button } from "@mui/material";
import {useNavigate} from "react-router-dom";
import config from "../utils/config";
import {config as configRoute} from "../routes/routes";
import {getTestPlan} from "../utils/testPlan";

const SummaryView = () => {
    const url = new URL(window.location.href);

    const navigate = useNavigate();

    const plan = getTestPlan();
   
    const clickBackHandler = () => {
        navigate(plan[0].route || configRoute.callback.route);
    }
    
    const clickNextHandler = () => {
        if (url.searchParams.has("callback")) {
            window.location.href = `${url.searchParams.get("callback")}`;
            return;
        }

        window.location.href = config.defaultCallbackUrl;
    }
    
    return (
        <Grid className="end-page">
            <Grid className="main-end-page">
                <Grid className="title">
                    <Typography>Wie gut ist Ihre Verbindung?</Typography>
                </Grid>
                <Grid className="sub-title">
                    <Typography>Sie haben Ihre Verbindung und angeschlossenen Geräte getestet.</Typography>
                </Grid>
                <Stack spacing={2} direction={{ xs: 'column' }} className="end-page-content">
                    <Grid>
                        <Typography className="strong-text">Ist die Qualität ausreichend?</Typography>
                        <Grid>
                            <Typography className="text sub-text">Dann kehren Sie zurück zur Startseite.</Typography>
                        </Grid>
                    </Grid>
                    <Grid>
                        <Typography className="strong-text">Ist Ihre Verbindung in Bild und/oder Ton zu schlecht?</Typography>
                        <Grid>
                            <Typography className="text">Folgen Sie den Anweisungen des Tests und holen Sie sich ggf. Unterstützung in der Einrichtung Ihrer Geräte.</Typography>
                        </Grid>
                    </Grid>
                </Stack>
                <Divider className="divider" />

                <Stack alignItems={{ xs : 'center' }} spacing={2} direction={{ xs: 'column', md: 'row' }} className="buttons-group">
                    <Button className="button-back" variant="outlined" onClick={clickBackHandler}>zurück zum Teststart</Button>
                    <Button className="button-next" variant="contained" onClick={clickNextHandler}>Test verlassen</Button>
                </Stack>

                <Grid className="footer"></Grid>
            </Grid>
        </Grid>
    )
}


export default SummaryView;