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

import { useReducer } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';
import GlobalState from './context';
import { ReactQueryDevtools } from "react-query/devtools";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Routes from "./routes/routes";
import theme from "./themes/theme";


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 2,
            staleTime: 0
        },
    },
});

function App() {
  const [state, updateState] = useReducer((state: any, next: any) => {
    return {...state, ...next};
  }, {});


  return (
      <GlobalState.Provider value={{state, updateState}}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Routes/>
          </ThemeProvider>
        </QueryClientProvider>
      </GlobalState.Provider>
  );
}

export default App;
