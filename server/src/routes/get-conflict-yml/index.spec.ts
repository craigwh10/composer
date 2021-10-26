import { build } from "../../__mocks__/helpers/fastifyBuild";
import { getFakeComposePathArrayFromCwd } from "../../__mocks__/helpers/getFakeComposePathArrayFromCwd";

const app = build();

describe("/get-conflict-yml?composePaths={composePaths} (API test)", () => {
   it("with no params should return 400", async () => {
      const result = await app.inject({
         url: "/get-conflict-yml",
      });

      expect(result.statusCode).toBe(400);
   });

   it("with an empty path that returns no files should return 400", async () => {
      const result = await app.inject({
         url: "/get-conflict-yml",
         query: { composePaths: "" },
      });

      expect(result.statusCode).toBe(400);
      expect(result.json()).toEqual({
         RequestError: "No compose paths provided in this request.",
      });
   });

   it("with a path set that returns no results should return 200", async () => {
      const result = await app.inject({
         headers: {
            "Content-Type": "application/json",
         },
         url: `/get-conflict-yml`,
         query: { composePaths: getFakeComposePathArrayFromCwd(process.cwd()) },
      });

      expect(result.statusCode).toBe(200);
      expect(result.json()["ymlResult"].length).not.toBeGreaterThan(30);
   });

   it("with a path set that returns results should return 200", async () => {
      const result = await app.inject({
         headers: {
            "Content-Type": "application/json",
         },
         url: `/get-conflict-yml`,
         query: {
            composePaths: getFakeComposePathArrayFromCwd(process.cwd(), true),
         },
      });

      expect(result.statusCode).toBe(200);
      expect(result.json()["ymlResult"].length).toBeGreaterThan(30);
   });
});
