import { build } from "../../__mocks__/helpers/fastifyBuild";
import {
   getFakeFilePathFromCwd,
   getFakeFilePathNoResultsFromCwd,
} from "../../__mocks__/helpers/getFakeFilePathFromCwd";

const app = build();

describe("/compose-paths/${path}?searchDepth={searchDepth} (API test)", () => {
   it("should return 404 if no compose paths found in area", async () => {
      const fakePath = getFakeFilePathNoResultsFromCwd(process.cwd());

      const result = await app.inject({
         url: `/compose-paths/${fakePath}`,
         query: { depth: "0" },
      });

      expect(result.statusCode).toBe(404);
   });

   it("with no params should return 400", async () => {
      const result = await app.inject({
         url: "/compose-paths/",
      });

      expect(result.statusCode).toBe(400);
   });

   it("with a path that returns no files should return 500", async () => {
      const result = await app.inject({
         url: "/compose-paths/sheeeeeesh",
      });

      expect(result.statusCode).toBe(500);
      expect(result.json()).toEqual({
         error: "Internal Server Error",
         message: "Path doesnt exist on your computer: ",
         statusCode: 500,
      });
   });

   it("with a path that returns files should return 200", async () => {
      const fakePath = getFakeFilePathFromCwd(process.cwd());

      const result = await app.inject({
         url: `/compose-paths/${fakePath}`,
         query: { depth: "5" },
      });

      expect(result.statusCode).toBe(200);
      expect(result.json()["composePaths"].length).toEqual(15);
   });
});
