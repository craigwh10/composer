import React, { useState, createContext } from "react";
import type { Dispatch } from "react";

export type filePathContextState = string | null;
export type filePathContextSetters = Dispatch<
   React.SetStateAction<filePathContextState>
>;

export type filePathContext = {
   filePath: filePathContextState;
   setFilePath: filePathContextSetters;
};

export const FilePathContext = createContext<filePathContext>({
   filePath: null,
   setFilePath: () => {},
});

export function filePathContext() {
   return FilePathContext;
}

export default function FilepathProvider(props: any) {
   const { Provider } = filePathContext();
   const { children } = props;

   const [filePath, setFilePath] = useState<filePathContextState>(null);

   return (
      <Provider
         value={{
            filePath,
            setFilePath,
         }}
      >
         {children}
      </Provider>
   );
}
