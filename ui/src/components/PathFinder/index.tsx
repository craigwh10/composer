import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { FilePathContext } from "../../context/FilepathContext";
import { useComposePaths } from "../../hooks/useComposePaths";

export const PathFinder = () => {
   const { filePath } = useContext(FilePathContext);

   const [searchDepth, setSearchDepth] = useState<number>(2);
   const [shortenedPath, setShortenedPath] = useState<string | null>(null);

   const {
      data: composeData,
      getComposePathsByPath,
      error,
      isLoading,
   } = useComposePaths(filePath);

   useEffect(() => {
      if (!filePath) return;
      if (searchDepth > filePath.split("/").length) return;
      const initialDirectoryPath = filePath.split("/");
      initialDirectoryPath.pop();

      const initialPath = initialDirectoryPath
         .slice(0, initialDirectoryPath.length - searchDepth)
         .join("/");

      setShortenedPath(initialPath);
   }, [searchDepth, filePath]);

   const handleChangeSearchDepth = (e: ChangeEvent<HTMLInputElement>) => {
      setSearchDepth(Number(e.target.value));
   };

   const handleSubmit = async () => {
      if (filePath) {
         await getComposePathsByPath({
            chosenSearchPath: filePath,
            directoriesFromInitial: searchDepth,
         });
      }
   };

   return (
      <div data-testid="pathFinder">
         {filePath && (
            <input
               type="number"
               min={1}
               max={filePath.split("/").length - 3}
               value={searchDepth}
               onChange={handleChangeSearchDepth}
               data-testid={"pathFinder-searchDepth"}
            />
         )}
         <div data-testid={"pathFinder-searchResult"}>
            {shortenedPath ? shortenedPath : filePath}
         </div>
         <button
            onClick={handleSubmit}
            disabled={!filePath || isLoading}
            data-testid={"pathFinder-searchComposeButton"}
         >
            {isLoading ? "Loading results..." : "Search for compose files"}
         </button>
         {error && <div>{JSON.stringify(error)}</div>}
         {composeData?.composePaths ? (
            <details>
               <summary>
                  See returned {composeData.composePaths.length} compose files (
                  {Math.round(
                     composeData.timeTakenMs / composeData.searchedDirs
                  )}
                  ms/dir,{Math.round(composeData.timeTakenMs)}ms,{" "}
                  {Math.round(composeData.averageMemory)}mb)
               </summary>
               <pre>
                  <code>
                     {composeData.composePaths.map(
                        (composePath) => `${composePath}\n`
                     )}
                  </code>
               </pre>
            </details>
         ) : (
            <div></div>
         )}
      </div>
   );
};
