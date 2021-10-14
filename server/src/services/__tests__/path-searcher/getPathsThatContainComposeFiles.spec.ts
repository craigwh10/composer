import { getPathsThatContainComposeFiles } from "../../path-searcher/getPathsThatContainComposeFiles";

describe("getPathsThatContainComposeFile", () => {
  describe("when working expectedly", () => {
    const pathInput = [
      "/test/value/test-ms/docker-compose.yml",
      "/test/value/test-ms/docker-compose.json",
      "/test/value/test-ms/docker-compose.jar",
      "/test/test-ms/docker-compose",
      "/test/value/test-ms/docker-compose.c",
      "/test/docker-compose.yml",
      "/test/docker-compose.json",
      "/test/docker-compose.jsoon",
    ];

    it("should return compose yml & json files when they exist", async () => {
      const result = await getPathsThatContainComposeFiles(pathInput);

      expect(result.sort()).toEqual(
        [
          "/test/value/test-ms/docker-compose.yml",
          "/test/docker-compose.yml",
          "/test/value/test-ms/docker-compose.json",
          "/test/docker-compose.json",
        ].sort()
      );
    });

    it("should return empty array if no paths match", async () => {
      const result = await getPathsThatContainComposeFiles([
        "/test/docker-compose.jsoon",
        "/test/docker-compose.jsoon",
      ]);

      expect(result).toEqual([]);
    });
  });
});
