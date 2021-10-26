import { useQuery } from "react-query";
import { fetchAsJson } from "../__utils__/fetchAsJson";

interface IUseConflictYmlResult {
   ymlResult: string;
   timeTakenMs: number;
   averageMemory: number;
}

export const useConflictYml = (chosenSearchPath: string | null) => {
   const HOOK_KEY = `useConflictYml-${chosenSearchPath}`;

   const { isLoading, data, error } = useQuery(
      HOOK_KEY,
      async (): Promise<IUseConflictYmlResult | undefined> => {
         if (!chosenSearchPath) return;

         return fetchAsJson("get-conflict-yml", [
            {
               name: "composePaths",
               value: chosenSearchPath,
               valueIsPath: true,
               isQuery: true,
            },
         ]);
      }
   );

   return {
      isLoading,
      data,
      error,
   };
};
