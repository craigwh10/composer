import React from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import * as serviceWorker from "./serviceWorker";
import { Routes } from "./routes";

const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         refetchOnWindowFocus: false,
         refetchOnReconnect: false,
         retry: false,
      },
   },
});

ReactDOM.render(
   <React.StrictMode>
      <QueryClientProvider client={queryClient}>
         <Routes />
      </QueryClientProvider>
   </React.StrictMode>,
   document.getElementById("root")
);

serviceWorker.unregister();
