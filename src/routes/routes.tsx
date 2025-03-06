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

import { Navigate, RouteObject, useRoutes } from 'react-router-dom';
import MinimalLayout from "../layouts/MinimalLayout";
import VideoView from "../views/VideoView";
import SettingsView from '../views/SettingsView';
import SummaryView from '../views/SummaryView';
import MicrophoneView from '../views/MicrophoneView';
import SpeakerView from '../views/SpeakerView';
import RootView from "../views/RootView";

export const config:{
    [key: string]: {
        route: string
    }
} = {
    landing: {
        route: '/landing'
    },
    video: {
        route: '/video'
    },
    mic: {
        route: '/microphone'
    },
    speaker: {
        route: '/speaker'
    },
    summary: {
        route: '/summary'
    },
    callback: {
        route: '/callback'
    }
}

const MainRoutes: RouteObject = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: '/',
            element : <RootView />
        },
        {
            path: config.landing.route,
            element : <SettingsView />
        },
        {
            path: config.video.route,
            element: <VideoView />
        },
        {
            path: config.mic.route,
            element: <MicrophoneView />
        },
        {
            path: config.speaker.route,
            element: <SpeakerView />
        },
        {
            path: config.summary.route,
            element: <SummaryView />
        },
        { path: '*',  element:  <Navigate to='/' replace /> }
    ]
};


export default function Routes() {
    return useRoutes([MainRoutes]);
}