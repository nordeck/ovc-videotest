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

import config from "./config";
import {TJwt} from "./types";
import {useQuery} from "react-query";


export function getJwtEndpoint(roomName: string):string {
    if (!config.jwtEndpointUrl) return '';
    const urlString = config.jwtEndpointUrl.replace("{roomName}", encodeURI(roomName));
    const jwtUrl = new URL(urlString);
    return jwtUrl.href;
}

export function generateRoomName() {
    return `${config.roomPrefix}${crypto.randomUUID()}`
}

export function useJwt(room: string, queryEnabled:boolean) {

    const  getJwt = async (roomName: string):Promise<TJwt> =>  {
        const url = getJwtEndpoint(roomName);

        const requestOptions: RequestInit = {
            method: 'GET'
        };

        // hardcoded token to use without a backend
        if (config.jitsiJWT) {
            return {
                jwt: config.jitsiJWT
            }
        }

        if (!url) {
            return {
                jwt: ''
            }
        }

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
            throw new Error('jwt fetch fail');
        }

        return response.json();
    }

    const { isLoading, isError, data, refetch } = useQuery<TJwt, Error>(
        ['jwt', room],
        () => getJwt(room),
        {
            enabled: queryEnabled,
            staleTime: Infinity,
            cacheTime: 1,
            refetchOnMount: false,
            retryOnMount: false,
            retry: false
        }
    );

    return {
        jwt: data?.jwt,
        isLoading,
        isError,
        refetch
    }

}