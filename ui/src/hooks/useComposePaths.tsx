import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";

interface composePathReturn {
   timeTakenMs: number;
   searchedDirs: number;
   composePaths: Array<string>;
   averageMemory: number;
}

interface FetchComposePathsInput {
   chosenSearchPath: string;
   directoriesFromInitial?: number;
}

export const fetchComposePaths = async ({
   chosenSearchPath,
   directoriesFromInitial = 5,
}: FetchComposePathsInput): Promise<composePathReturn | undefined> => {
   if (!chosenSearchPath) {
      return;
   }

   const headers = {
      method: "GET",
      headers: {
         "Access-Control-Allow-Origin": "*",
         "Cache-Control": "no-cache",
         "Content-Type": "application/json",
      },
   };

   const path = new URLSearchParams(chosenSearchPath)
      .toString()
      .replace("=", "");

   return fetch(
      `http://localhost:3010/compose-paths/${path}?depth=${directoriesFromInitial}`,
      headers
   ).then((res) => res.json());
};

export const useComposePaths = (chosenSearchPath: string | null) => {
   const queryClient = useQueryClient();
   const [mutateIsLoading, setMutateIsLoading] = useState(false);

   const HOOK_KEY = `useComposePaths-${chosenSearchPath}`;

   const { isLoading, data, error } = useQuery<
      composePathReturn | undefined,
      Error
   >(
      HOOK_KEY,
      async () => {
         if (!chosenSearchPath) throw new Error("No path provided");
         return getComposePathsByPath({ chosenSearchPath });
      },
      {
         enabled: false,
         initialData: undefined,
      }
   );

   const { mutateAsync: getComposePathsByPath } = useMutation<
      composePathReturn | undefined,
      undefined,
      { chosenSearchPath: string; directoriesFromInitial?: number }
   >(
      HOOK_KEY,
      async ({ chosenSearchPath, directoriesFromInitial }) => {
         setMutateIsLoading(true);
         return fetchComposePaths({ chosenSearchPath, directoriesFromInitial });
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
