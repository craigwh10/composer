import { QueryClient, QueryClientProvider } from "react-query";
import { queryClientOptions } from "../../shared/config/queryClientOptions";
import { renderHook } from "@testing-library/react-hooks";
import React, { ReactElement } from "react";

const QueryWrapper = ({
   children,
}: {
   children: ReactElement;
}): ReactElement => {
   const queryClient = new QueryClient(queryClientOptions);

   return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
   );
};

export const renderTestHook = async (hook: any, params: Array<any>) => {
   const { result, waitForNextUpdate, waitForValueToChange } = renderHook(
      () => hook(...params),
      { wrapper: QueryWrapper }
   );

   return { result, waitForNextUpdate, waitForValueToChange };
};
