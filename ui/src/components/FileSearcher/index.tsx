import React, { ChangeEvent, useContext } from "react";
import { FilePathContext } from "../../context/FilepathContext";

import EventNames from "../../shared/EventNames";

export const FileSearcher = () => {
   const { filePath, setFilePath } = useContext(FilePathContext);

   const handleOnClick = async () => {
      const result: [string] = await window.ipcRenderer.invoke(
         EventNames.OPEN_PATH_FINDER
      );
      setFilePath(result[0]);
   };

   const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
      setFilePath(e.target.value);
   };

   return (
      <>
         <button
            data-testid="directorySelect-button"
            type="button"
            value={filePath ? filePath : ""}
            onClick={handleOnClick}
         >
            {filePath ? "Reselect Directory" : "Select Directory"}
         </button>
         {process.env.REACT_APP_IS_TEST && (
            <input
               data-testid="directorySelect-hidden-input"
               onChange={handleOnChange}
            />
         )}
      </>
   );
};

declare global {
   interface Window {
      // TODO: Needs IpcRender type.
      ipcRenderer: any;
   }
}
