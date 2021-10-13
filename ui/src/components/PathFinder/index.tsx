import React, { useState } from "react";
import EventNames from "../../shared/EventNames";

const { ipcRenderer } = window.require("electron");

interface PathFinderProps {
  onSubmit: (filePath: string) => {};
}

export const PathFinder = ({ onSubmit }: PathFinderProps) => {
  const [filePath, setFilePath] = useState<string | null>(null);

  return (
    <>
      <button
        type="button"
        value="Select File"
        onClick={() => getPathFromFinder(setFilePath)}
      >
        Select Files
      </button>
      <button
        onClick={() => filePath && onSubmit(filePath)}
        disabled={!filePath}
      >
        Search for compose files
      </button>
    </>
  );
};

const getPathFromFinder = async (
  setFilePath: React.Dispatch<React.SetStateAction<string | null>>
): Promise<void> => {
  const result = await ipcRenderer.invoke(EventNames.OPEN_PATH_FINDER);

  setFilePath(result);
};
