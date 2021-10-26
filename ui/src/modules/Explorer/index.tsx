import React from "react";

import FilePathProvider from "../../context/FilepathContext";

import { PathFinder } from "../../components";
import { GenerateConflictYml } from "../../components/GenerateConflictYml";
import { FileSearcher } from "../../components/FileSearcher";

export const Explorer = () => {
   return (
      <FilePathProvider>
         <FileSearcher />
         <PathFinder />
         <GenerateConflictYml type={"docker-compose"} />
      </FilePathProvider>
   );
};
