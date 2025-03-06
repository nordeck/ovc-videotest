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

import {config} from "../routes/routes";

type TTestPlan = {
    id: string,
    route: string,
    next: TTestPlan | null,
    prev: TTestPlan | null
}

export function getTestPlan() {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;

    const DEFAULT_TEST_PARAM = 'video,mic,speaker';

    const parse = (param: string | null): TTestPlan[] => {
        if (!param) return [];
        return param
            .split(',')
            .map((o) => o.trim())
            .filter(o => !!config[o])
            .map(o => {
                return {
                    id: o,
                    route: config[o].route,
                    next: null,
                    prev: null
                }
            });
    }

    const plan = parse(searchParams.get('tests') || DEFAULT_TEST_PARAM) || [];

    for (let i = 0; i < plan.length; i++) {
        if (i + 1 < plan.length) {
            plan[i].next = plan[i + 1];
        }
        if (i - 1 >= 0) {
            plan[i].prev = plan[i - 1];
        }
    }

    return plan;
}