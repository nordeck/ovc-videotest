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

export const routeToCallback = () => {
    const allowed = config.allowedCallbackUrls?.split(',') || [];
    const url = new URL(window.location.href);

    if (url.searchParams.has("callback")) {
        const callbackUrl = url.searchParams.get("callback") || '';

        const isAllowed = allowed.length > 0
            ? !!allowed.find(o => callbackUrl.startsWith(o))
            : true;

        if (isAllowed) {
            window.location.href = `${url.searchParams.get("callback")}`;
            return;
        }
    }

    window.location.href = config.defaultCallbackUrl;
}