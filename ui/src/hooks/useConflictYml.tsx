import { useQuery } from "react-query";

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
         const headers = {
            method: "GET",
            headers: {
               "Access-Control-Allow-Origin": "*",
               "Cache-Control": "no-cache",
               "Content-Type": "application/json",
            },
         };

         if (!chosenSearchPath) {
            throw new Error("No chosen search path.");
         }

         const paths = new URLSearchParams(chosenSearchPath)
            .toString()
            .replace("=", "");

         const result = await fetch(
            `http://localhost:3010/get-conflict-yml?composePaths=${paths}`,
            headers
         );

         return result.json();
      }
   );

   return {
      isLoading,
      data,
      error,
   };
};
