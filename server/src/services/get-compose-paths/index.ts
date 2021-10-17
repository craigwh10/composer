import fs from "fs";
import path from "path";
import * as benchmark from "../../benchmark/utils";

interface PathSearcherInputs {
  pathToInitialFile: string;
  directoriesToIgnore?: Array<string>;
  numberOfDirsFromCurrent?: number;
}

interface PathSearcherResponse {
  composePaths: Array<string>;
  searchedDirs: number;
  timeTakenMs: number;
  averageMemory: number;
}

export async function getComposePaths({
  pathToInitialFile,
  directoriesToIgnore = ["node_modules"],
  numberOfDirsFromCurrent = 5,
}: PathSearcherInputs): Promise<PathSearcherResponse> {
  const startTime = benchmark.timeStart();
  const startMemory = benchmark.getMemory();

  const ignoreMatches = new RegExp(
    "(" + directoriesToIgnore.join("|") + ")",
    "g"
  );

  const initialDirectoryPath = pathToInitialFile.split("/");
  initialDirectoryPath.pop();

  const initialPath = initialDirectoryPath
    .slice(0, initialDirectoryPath.length - numberOfDirsFromCurrent)
    .join("/");

  if (initialPath.match(ignoreMatches)) {
    throw new Error(
      "Number of dirs from current leads to an ignored directory"
    );
  }

  let composePaths: string[] = [];

  return new Promise(function (resolve) {
    let searchCount = 0;
    let totalSearchCount = 0;
    let cachedDirs: string[] = [initialPath];
    let searchDirsLength: number = 0;
    let cachedDirRow = 0;

    function checkDirectory() {
      let total = cachedDirs.length;
      for (; cachedDirRow < cachedDirs.length; cachedDirRow++) {
        // Save the dir path to be checked against
        const dir = cachedDirs[cachedDirRow];

        if (dir.match(ignoreMatches)) {
          return;
        }

        fs.readdir(dir, {}, function (err, filesOrDirs) {
          filesOrDirs.forEach((item) => {
            const fullPath = `${dir}/${item}`;

            if (item.match(ignoreMatches)) {
              // Skip this check if directory is ignored.
              return;
            }

            // Is a compose file
            if (
              item.match(/^(.)*(docker|compose)((\.\w*){0,4})\.(yml|json)+$/g)
            ) {
              composePaths.push(fullPath);
            }

            if (
              // item is a directory
              !item.match(/([\w]+\.)+[\w]+(?=[\s]|$)/g) &&
              // ignore hidden files
              !item.match(/^\..*/)
            ) {
              cachedDirs.push(fullPath);
              totalSearchCount++;
            }
          });

          // All rows checked

          if (++searchCount === total) {
            if (cachedDirs.length === cachedDirRow) {
              resolve({
                composePaths,
                searchedDirs: totalSearchCount,
                timeTakenMs: benchmark.timeEnd(startTime),
                averageMemory: benchmark.getAverageValue([
                  startMemory,
                  benchmark.getMemory(),
                ]),
              });
            } else {
              // If more dirs added, continue scanning
              checkDirectory();
            }
          }
        });
      }
    }

    // Initialise.
    checkDirectory();
  });
}