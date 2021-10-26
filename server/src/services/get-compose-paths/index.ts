import fs, { statSync } from "fs";
import type { FastifyLoggerInstance } from "fastify";

import * as benchmark from "../../benchmark/utils";

interface PathSearcherInputs {
   pathToInitialFile: string;
   directoriesToIgnore?: Array<string>;
   numberOfDirsFromCurrent?: number;
   logger: FastifyLoggerInstance;
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
   logger,
}: PathSearcherInputs): Promise<PathSearcherResponse | undefined> {
   const { timeTakenMs, averageMemory } = benchmark.serviceBenchmarks();

   const ignoreMatches = new RegExp(
      "(" + directoriesToIgnore.join("|") + ")",
      "g"
   );

   logger.info({
      message: `initialised method`,
      params: {
         pathToInitialFile,
         directoriesToIgnore,
         numberOfDirsFromCurrent,
      },
   });

   const initialDirectoryPath = pathToInitialFile.split("/");
   initialDirectoryPath.pop();

   const initialPath = initialDirectoryPath
      .slice(0, initialDirectoryPath.length - numberOfDirsFromCurrent)
      .join("/");

   logger.info({
      message: `initial paths generated`,
      result: initialPath,
   });

   const pathExists = fs.existsSync(initialPath);

   if (!pathExists) {
      const err = new Error(
         `Path doesnt exist on your computer: ${initialPath}`
      );

      logger.error({
         message: err.message,
         stack: err.stack,
         params: initialPath,
      });

      throw err;
   }

   if (initialPath.match(ignoreMatches)) {
      const err = new Error(
         "Number of dirs from current leads to an ignored directory"
      );

      logger.error({
         message: err.message,
         stack: err.stack,
         params: initialPath,
      });

      throw err;
   }

   let composePaths: string[] = [];

   return new Promise(function (resolve) {
      let searchCount = 0;
      let totalSearchCount = 0;
      let cachedDirs: string[] = [initialPath];
      let cachedDirRow = 0;

      function checkDirectory() {
         const total = cachedDirs.length;
         for (; cachedDirRow < cachedDirs.length; cachedDirRow++) {
            // Save the dir path to be checked against
            const dir = cachedDirs[cachedDirRow];

            if (dir.match(ignoreMatches)) {
               return;
            }

            fs.readdir(dir, {}, function (err, filesOrDirs) {
               if (!filesOrDirs) return;

               filesOrDirs.forEach((item) => {
                  const fullPath = `${dir}/${item}`;

                  if (item.match(ignoreMatches)) {
                     // Skip this check if directory is ignored.
                     return;
                  }

                  // Is a compose file
                  if (
                     item.match(
                        /^(.)*(docker|compose)((\.\w*){0,4})\.(yml|json)+$/g
                     )
                  ) {
                     composePaths.push(fullPath);
                  }

                  // Check if is not an alias
                  if (!fs.existsSync(fullPath)) return;

                  const stats = statSync(fullPath);

                  if (
                     // ignore hidden files
                     !item.match(/^\..*/) &&
                     !stats.isSymbolicLink() &&
                     stats.isDirectory()
                  ) {
                     cachedDirs.push(fullPath);
                     totalSearchCount++;
                  }
               });

               // All rows checked

               if (++searchCount === total) {
                  if (cachedDirs.length === cachedDirRow) {
                     logger.info({
                        message: `result`,
                        result: {
                           composePaths,
                           searchedDirs: totalSearchCount,
                           timeTakenMs: timeTakenMs(),
                           averageMemory: averageMemory(),
                        },
                     });
                     resolve({
                        composePaths,
                        searchedDirs: totalSearchCount,
                        timeTakenMs: timeTakenMs(),
                        averageMemory: averageMemory(),
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
