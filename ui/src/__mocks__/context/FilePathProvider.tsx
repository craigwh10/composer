import { render } from "@testing-library/react";
import React, { ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { queryClientOptions } from "../../shared/config/queryClientOptions";
import {
   FilePathContext,
   filePathContext,
} from "../../context/FilepathContext";

export const renderWithFilePathContextAndQueryClient = (
   children: ReactElement,
   providerProps: filePathContext,
   hasQuery: boolean = false
) => {
   if (hasQuery) {
      const queryClient = new QueryClient(queryClientOptions);

      return render(
         <QueryClientProvider client={queryClient}>
            <FilePathContext.Provider value={providerProps}>
               {children}
            </FilePathContext.Provider>
         </QueryClientProvider>
      );
   }

   return render(
      <FilePathContext.Provider value={providerProps}>
         {children}
      </FilePathContext.Provider>
   );
};
