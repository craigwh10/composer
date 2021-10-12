// Reads potential route files - then imports them in and runs them.
import fs from "fs";
import path from "path";

export async function initialiseRoutes(): Promise<boolean> {
  let routesInitialised = false;
  const parentDirPath = path.join(__dirname);

  const parentDirs = fs
    .readdirSync(parentDirPath)
    .filter((item) => (item !== "__tests__" ? item !== "index.ts" : false));

  const numberOfRoutes = parentDirs.length;

  parentDirs.forEach((dir, index) => {
    require(`${parentDirPath}/${dir}/index.ts`)(dir);

    if (index === numberOfRoutes - 1) {
      routesInitialised = true;
    }
  });

  return routesInitialised;
}
