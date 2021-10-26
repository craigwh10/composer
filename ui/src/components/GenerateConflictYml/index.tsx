import React, { useContext } from "react";
import type { ReactElement } from "react";
import { useConflictYml } from "../../hooks/useConflictYml";
import { useComposePaths } from "../../hooks/useComposePaths";
import { FilePathContext } from "../../context/FilepathContext";

interface GenerateConflictYmlProps {
   type: "docker-compose";
}

export const GenerateConflictYml = ({
   type,
}: GenerateConflictYmlProps): ReactElement => {
   const { filePath } = useContext(FilePathContext);

   const { data: composeData } = useComposePaths(filePath);

   const { data: ymlData } = useConflictYml(
      composeData?.composePaths ? composeData.composePaths.join(",") : null
   );

   if (ymlData?.ymlResult) {
      return (
         <div
            className={`generateconflictyml-${type}`}
            data-testid={`generateconflictyml-${type}`}
         >
            <details>
               <summary>
                  See generated yml from conflicts (
                  {Math.round(ymlData.timeTakenMs)}ms,{" "}
                  {Math.round(ymlData.averageMemory)}mb)
               </summary>
               <pre>
                  <code>{ymlData.ymlResult}</code>
               </pre>
            </details>
         </div>
      );
   } else {
      return <div></div>;
   }
};
