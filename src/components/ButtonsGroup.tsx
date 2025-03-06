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

import { Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ButtonsGroupProps } from "../utils/types";
import {config as configRoute} from "../routes/routes";
import {routeToCallback} from "../utils/routeUtils";

const ButtonsGroup = ({ text, navigation } : ButtonsGroupProps) => {

    const navigate = useNavigate();
   
    const clickNextHandler = () => {
        if (navigation.next === configRoute.callback.route) {
            routeToCallback();
            return;
        }

        navigate(navigation.next);
    };
    
    const clickBackHandler = () => {
        routeToCallback();
    }

    return (
        <Stack alignItems={{ xs : 'center' }} spacing={2} direction={{ xs: 'column', md: 'row' }} className="buttons-group">
            {text.back && <Button className="button-back" variant="outlined" onClick={clickBackHandler}>{text.back}</Button>}
            {text.next && <Button className="button-next" variant="contained" onClick={clickNextHandler}>{text.next}</Button>}
        </Stack>
    );
}


export default ButtonsGroup;