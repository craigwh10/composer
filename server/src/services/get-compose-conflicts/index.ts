import yaml from "js-yaml";
import fs from "fs";
import util from "util";

const readFile = util.promisify(fs.readFile);

interface GetComposeConflicts {
  composePaths: Array<string>;
}

interface Conflict {
  comparedPath: string;
  // Want to include them all for use
  conflictedService: unknown;
}

interface ComposeGenericSchemaService {
  container_name: string;
  image: string;
  networks: Array<string>;
  volumes: Array<string>;
}

interface ComposeGenericSchemaServices {
  [key: string]: ComposeGenericSchemaService;
}

interface ComposeGenericSchema {
  version: string;
  services: ComposeGenericSchemaServices;
}

export async function getComposeConflicts({
  composePaths,
}: GetComposeConflicts): Promise<Array<Conflict>> {
  let storedComposeJson: Array<{
    path: string;
    jsonCompose: ComposeGenericSchema;
  }> = [];
  let pathsCheckedTogether: Array<[string, string]> = [];
  let conflicts: Array<Conflict> = [];

  // Convert all compose files into json.
  for (const composePath of composePaths) {
    const result = await readFile(composePath, "utf8");
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
      // Otherwise don't do anything
      if (pathsCheckedTogether.indexOf(pathsBeingChecked) === -1) {
        // TODO: QUESTION: Is versioning needed to be considered
        //                 much here?

        for (const service of Object.values(pathJson.jsonCompose.services)) {
          // Check if service uses same image
          // as any in compared service.
          // TODO: QUESTION: Is this adequate for finding dependencies?
          if (
            Object.values(pathJsonToCheckAgainst.jsonCompose.services).some(
              ({ image }) => {
                return image === service.image;
              }
            )
          ) {
            conflicts.push({
              comparedPath: pathJson.path,
              conflictedService: service,
            });
          }
        }

        pathsCheckedTogether.push(pathsBeingChecked);
      }
    }
  }

  return conflicts;
}
