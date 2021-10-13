import fs from "fs";
import path from "path";

interface PathSearcherInputs {
  pathToInitialFile: string;
  searchDepth?: number;
}

export async function pathSearcher({
  pathToInitialFile,
  searchDepth = 5,
}: PathSearcherInputs) {
  const initialRoot = await fs.readdirSync(
    `../`.repeat(searchDepth) + pathToInitialFile
  );

  return "test";
}
