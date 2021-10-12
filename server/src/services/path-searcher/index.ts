interface PathSearcherInputs {
  pathToInitialFile: string;
  searchDepth?: number;
}

export async function pathSearcher({
  pathToInitialFile,
  searchDepth = 5,
}: PathSearcherInputs) {
  console.log(pathToInitialFile);

  return "his";
}
