import yaml from "js-yaml";
import fs from "fs";
import util from "util";

const readFile = util.promisify(fs.readFile);

interface GetComposeConflicts {
  composePaths: Array<string>;
}

interface Conflict {
  comparedPath: string;
  serviceName: string;
  // Want to include them all for use
  properties: unknown;
}

interface CheckResults {
  composePath: string;
  conflict: Array<Conflict>;
}

export async function getComposeConflicts({
  composePaths,
}: GetComposeConflicts): // Temporarily
Promise<Array<CheckResults> | any> {
  // Initialise check results.
  // Store current path.
  // Initialise readRow value as 0.
  // Initialise initialPathsChecked as {0, initialPathsChecked}.
  // Have a cached check at the start of all the paths minus current.
  // Loop through all cached paths.
  // ++readRow
  // until readRow is equal to cached check.
  // ++ initialPathsChecked.
  // Add to check results if had conflicts within [services]
  // Recurse

  try {
    const result = await readFile(composePaths[0], "utf8");

    const asJson = yaml.load(result);
    console.log("result", asJson);
  } catch (err) {
    console.log(err);
  }
}
