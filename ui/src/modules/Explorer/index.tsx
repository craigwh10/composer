import React, { useState } from "react";

import FilePathProvider from "../../context/FilepathContext";

import { PathFinder, InfoBox } from "../../components";
import { useComposePaths } from "../../hooks/useComposePaths";

export const Explorer = ({}) => {
  const [searchInput, setSearchInput] = useState<string | null>(null);
  const { data, isLoading } = useComposePaths(searchInput);

  // TODO: move useComposePaths to be useComposePath and deal with them on a per component basis
  //       have electron app get the starting nodes and have server find which contain docker compose each.

  const onSubmitPathFind = (path: string) => {
    console.log(path);
    return {};
  };

  return (
    <FilePathProvider>
      <PathFinder onSubmit={onSubmitPathFind} />
      <InfoBox>
        Then click a docker-compose file that is within your directory of
        microservices.
      </InfoBox>
    </FilePathProvider>
  );
};
