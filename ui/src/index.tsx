import React from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import * as serviceWorker from "./serviceWorker";
import { Routes } from "./routes";
import { queryClientOptions } from "./shared/config/queryClientOptions";

const queryClient = new QueryClient(queryClientOptions);

ReactDOM.render(
   <React.StrictMode>
      <QueryClientProvider client={queryClient}>
         <Routes />
      </QueryClientProvider>
   </React.StrictMode>,
   document.getElementById("root")
);

serviceWorker.unregister();
