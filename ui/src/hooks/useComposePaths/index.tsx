import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchAsJson } from "../__utils__/fetchAsJson";

interface composePathReturn {
   timeTakenMs: number;
   searchedDirs: number;
   composePaths: Array<string>;
   averageMemory: number;
}

export const useComposePaths = (chosenSearchPath: string | null) => {
   const queryClient = useQueryClient();
   const [mutateIsLoading, setMutateIsLoading] = useState(false);

   const HOOK_KEY = `useComposePaths-${chosenSearchPath}`;

   const { isLoading, data, error } = useQuery<
      composePathReturn | undefined,
      Error
   >(
      HOOK_KEY,
      //@ts-ignore - mutation only hook.
      async (): composePathReturn => undefined,
      {
         enabled: false,
         initialData: undefined,
      }
   );

   const { mutateAsync: getComposePathsByPath } = useMutation<
      composePathReturn | undefined,
      undefined,
      { searchPath: string; directoriesFromInitial?: number }
   >(
      HOOK_KEY,
      async ({ searchPath, directoriesFromInitial = 5 }) => {
         setMutateIsLoading(true);
         if (!searchPath) {
            setMutateIsLoading(false);

            // TODO: Either replace this with return void or
            //       fix branch test issue mentioned in
            // https://github.com/craigwh10/composer/issues/41
            throw new Error("No path provided for query.");
         }

         return fetchAsJson("compose-paths", [
            { name: "path", value: searchPath, valueIsPath: true },
            { name: "depth", isQuery: true, value: directoriesFromInitial },
         ]);
      },
      {
         onSuccess: (res) => {
            queryClient.setQueryData(HOOK_KEY, () => {
               return res;
            });
            setMutateIsLoading(false);
         },
      }
   );

   return {
      isLoading: isLoading || mutateIsLoading,
      error,
      getComposePathsByPath,
      data,
   };
};
