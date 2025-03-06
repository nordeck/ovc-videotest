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

// provided fn may change on every render, but the returned function is stable
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {TFn} from "./types"
import {getTestPlan} from "./testPlan";


export function useStableCallback(fn: TFn): TFn {
    const ref: any = useRef(fn);

    useLayoutEffect(() => {
        ref.current = fn;
    });

    return useCallback<TFn>(
        (...args: any[]) => ref.current.apply(void 0, args),
        []
    );
}


export function useMediaAllowAccess() {
    const [mediaAllowed, setMediaAllowed] = useState(false);
    const [mediaError, setMediaError] = useState<string | null>(null);

    useEffect(() => {
        const constraints = {
            audio: true,
            video: true,
        };

        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(() => setMediaAllowed(true))
            .catch((error) => {
                switch (error.name) {
                    case 'OverconstrainedError':
                        setMediaError(error);
                        console.error(
                            `Constraints not supported by your device.`,
                        );
                        break;
                    case 'NotAllowedError':
                        setMediaError(error);
                        console.error(
                            "You need to grant this page permission to access your camera and microphone.",
                        );
                        break;
                    case 'NotReadableError':
                        setMediaError(error);
                        console.error(`NotReadableError:`, error);
                        break;
                    default:
                        setMediaError(error);
                        console.error(`getUserMedia error: ${error.name}`, error);
                }
        });
    }, []);

    return {
        mediaAllowed,
        mediaError
    };
}

type PlanItem = {
    id: string,
    next: string,
    prev: string
}

export function useTest(test:string) {
    const testPlan = getTestPlan();
    return testPlan.find(o => o.id === test);
}

