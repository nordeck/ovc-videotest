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

import {Box, LinearProgress} from "@mui/material";
import {ReactNode} from "react";

type JitsiFrameProps = {
    children: ReactNode,
    jwtError: boolean,
    jwtLoading: boolean,
    mediaAllowed: boolean,
    visible:boolean,
    mediaError: string | null
}

const JitsiFrameWrapper = ({jwtLoading, jwtError, children, mediaAllowed, mediaError, visible}:JitsiFrameProps) => {

    if (jwtError || mediaError) {
        return <Box sx={{width: '100%', height: '100%'}}><LinearProgress variant="determinate" color={"error"} value={50}/></Box>
    }

    if (jwtLoading) {
        return <Box sx={{width: '100%', height: '100%'}}><LinearProgress color={"secondary"}/></Box>
    }

    if (mediaAllowed && visible) {
        return <>{children}</>;
    }

    return <Box sx={{width: '100%', height: '100%'}}><LinearProgress/></Box>
}

export default  JitsiFrameWrapper;