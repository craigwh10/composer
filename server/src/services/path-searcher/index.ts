import fs from "fs";
import path from "path";

interface PathSearcherInputs {
  pathToInitialFile: string;
  directoriesToIgnore: Array<string>;
  searchDepth?: number;
}

export async function pathSearcher({
  pathToInitialFile,
  directoriesToIgnore = ["node_modules"],
  searchDepth = 5,
}: PathSearcherInputs): Promise<Array<string>> {
  // get all paths of each node
  // check if within this paths that it matches getPaths.

  return ["/test/docker-compose.yml"];
}
