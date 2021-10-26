import yaml from "js-yaml";
import fs from "fs";
import util from "util";
import type { FastifyLoggerInstance } from "fastify";
import * as benchmark from "../../benchmark/utils";

const readFile = util.promisify(fs.readFile);

interface GetComposeConflicts {
   composePaths: Array<string>;
   logger: FastifyLoggerInstance;
}

interface ComposeGenericSchemaService {
   container_name: string;
   image: string;
   networks: Array<string>;
   volumes: Array<string>;
}

interface ComposeGenericProperty {
   [key: string]: string | number;
}

interface ComposeGenericProperties {
   [key: string]: ComposeGenericProperty | string;
}

//https://github.com/compose-spec/compose-spec/blob/master/spec.md
interface Conflict {
   version?: string;
   services?: ComposeGenericSchemaService;
   volumes?: unknown;
   configs?: unknown;
   secrets?: unknown;
}

interface ComposeGenericSchemaServices {
   [key: string]: ComposeGenericSchemaService;
}

interface ComposeGenericSchema {
   version: string;
   services: ComposeGenericSchemaServices;
}

export interface IGetConflictYmlResult {
   ymlResult: string;
   averageMemory: number;
   timeTakenMs: number;
}

export async function getConflictYml({
   composePaths,
   logger,
}: GetComposeConflicts): Promise<IGetConflictYmlResult> {
   const { timeTakenMs, averageMemory } = benchmark.serviceBenchmarks();

   const COMPOSE_FIELD_OPTIONS = [
      "services",
      "volumes",
      "configs",
      "secrets",
      "networks",
      "version",
   ];

   logger.info({
      message: `conflict yml generation started`,
      params: { composePaths, acceptedFields: COMPOSE_FIELD_OPTIONS },
   });

   let storedComposeJson: Array<{
      path: string;
      jsonCompose: ComposeGenericSchema;
   }> = [];
   let pathsCheckedTogether: Array<[string, string]> = [];
   let conflictsComparable: Array<string> = [];
   let conflicts: Conflict = {};

   // Convert all compose files into json.
   for (const composePath of composePaths) {
      const pathExists = fs.existsSync(composePath);

      if (!pathExists) {
         const err = new Error(
            `Path doesnt exist on your computer: ${composePath}`
         );

         logger.error({
            message: err.message,
            stack: err.stack,
            params: { composePath },
         });

         throw err;
      }

      const result = await readFile(composePath, "utf8");

      if (!result) continue;

      const asJson = yaml.load(result) as ComposeGenericSchema;

      storedComposeJson.push({ path: composePath, jsonCompose: asJson });
   }

   for (const pathJson of storedComposeJson) {
      // Iterate pathJson over everything but itself.
      const pathJsonsToCheckAgainst = storedComposeJson;
      storedComposeJson.splice(storedComposeJson.indexOf(pathJson), 1);

      for (const pathJsonToCheckAgainst of pathJsonsToCheckAgainst) {
         const pathsBeingChecked = [
            pathJson.path,
            pathJsonToCheckAgainst.path,
         ].sort() as [string, string];

         // If it's not been checked before, do the check then add it as checked.
         // Otherwise don't do anything.

         logger.info({
            message: `checking two compose paths against each other`,
            params: { pathsBeingChecked },
         });

         if (pathsCheckedTogether.indexOf(pathsBeingChecked) === -1) {
            // TODO: QUESTION: Is versioning needed to be considered
            //                 much here?
            // Is deprecated in future compose, and how much do versions affect
            // these comparisons (field names etc etc)?

            for (const dependencyIndex in Object.values(pathJson.jsonCompose)) {
               const composeKeyBeingChecked = Object.keys(pathJson.jsonCompose)[
                  dependencyIndex
               ]; // service, volumes, network, etc..

               if (COMPOSE_FIELD_OPTIONS.includes(composeKeyBeingChecked)) {
                  // Note: Was originally this, removed and doesn't affect tests,
                  //       will look into this. @craig
                  // for (const nestedDependency in Object.values(
                  //    pathJson.jsonCompose[composeKey]
                  // )) {

                  // Iterate over nested dependencies
                  Object.values(
                     pathJson.jsonCompose[composeKeyBeingChecked]
                  ).forEach(() => {
                     // Initial to be compared against
                     const composeValue = Object.values(pathJson.jsonCompose)[
                        dependencyIndex
                     ];
                     const composeKey = Object.keys(pathJson.jsonCompose)[
                        dependencyIndex
                     ];

                     // If is a valid field based on compose schema.
                     if (COMPOSE_FIELD_OPTIONS.includes(composeKey)) {
                        Object.values(
                           composeValue as ComposeGenericProperties
                        ).forEach((composeItem, index) => {
                           const comparedComposeKey =
                              Object.keys(composeValue)[index];

                           if (
                              Object.values(
                                 pathJsonToCheckAgainst.jsonCompose[
                                    composeKey
                                 ] as ComposeGenericProperty
                              ).some((comparedComposeItem) => {
                                 const isComposeItemsEqual =
                                    comparedComposeItem[comparedComposeKey] ===
                                    composeItem[comparedComposeKey];

                                 return isComposeItemsEqual;
                              })
                           ) {
                              // Stringify so we can accurately compare results.
                              if (
                                 !conflictsComparable.includes(
                                    JSON.stringify({
                                       [comparedComposeKey]: composeItem,
                                    })
                                 )
                              ) {
                                 logger.info({
                                    message: `pushing that this conflict has been compared so we dont repeat`,
                                    params: {
                                       [comparedComposeKey]: composeItem,
                                    },
                                 });
                                 conflictsComparable.push(
                                    JSON.stringify({
                                       [comparedComposeKey]: composeItem,
                                    })
                                 );

                                 // If there is already a conflict there,
                                 // assign to the field instead of generating.
                                 if (conflicts[composeKey]) {
                                    conflicts[composeKey] = Object.assign(
                                       conflicts[composeKey],
                                       { [comparedComposeKey]: composeItem }
                                    );
                                 } else {
                                    // Version is only compose property to just be singular.
                                    if (composeKey === "version") {
                                       conflicts[composeKey] =
                                          composeItem as string;
                                    } else {
                                       // Generate the field and put first conflict item in it.
                                       // e.g: {services: {"test-ms": ...}}
                                       conflicts[composeKey] = {
                                          [comparedComposeKey]: composeItem,
                                       };
                                    }
                                 }
                              }
                           }
                        });
                     }
                  });
               }
            }

            pathsCheckedTogether.push(pathsBeingChecked);
         }
      }
   }

   logger.info({
      message: `completed conflict generation`,
      result: conflicts,
   });

   return {
      ymlResult: yaml.dump(conflicts),
      timeTakenMs: timeTakenMs(),
      averageMemory: averageMemory(),
   };
}
