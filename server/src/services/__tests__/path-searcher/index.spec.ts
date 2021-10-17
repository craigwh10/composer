import { pathSearcher } from "../../path-searcher/index";
import path from "path";

describe("pathSearcher", () => {
  describe("i'm passing in an absolute path to a file", () => {
    const pathToFakeFile = `${process.cwd()}/src/__tests__/support/fake_directory/test2/real-microservice/real.c`;

    it("should return the expected length of compose related files and be reasonably fast", async () => {
      const result = await pathSearcher({
        pathToInitialFile: pathToFakeFile,
        numberOfDirsFromCurrent: 2,
      });

      expect(result.timeTakenMs).toBeLessThan(20); // ms
      expect(result.searchedDirs).toEqual(24);
      expect(result.composePaths.length).toEqual(14);
    });

    it("should not include ignored directory results in query", async () => {
      const result = await pathSearcher({
        pathToInitialFile: pathToFakeFile,
        numberOfDirsFromCurrent: 2,
        directoriesToIgnore: ["real-microservice", "node_modules"],
      });

      expect(result.timeTakenMs).toBeLessThan(20); // ms
      expect(result.searchedDirs).toEqual(23);
      expect(result.composePaths.length).toEqual(13);
    });

    it("should return an error if dirs from current lands on ignored directory", async () => {
      try {
        await pathSearcher({
          pathToInitialFile: pathToFakeFile,
          numberOfDirsFromCurrent: 2,
          directoriesToIgnore: ["support"],
        });
      } catch (err) {
        expect(err).toEqual(
          new Error("Number of dirs from current leads to an ignored directory")
        );
      }
    });
  });
});
