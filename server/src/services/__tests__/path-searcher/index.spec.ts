import { pathSearcher } from "../../path-searcher/index";
import path from "path";

describe("pathSearcher", () => {
  describe("i'm passing in an absolute path to a file", () => {
    const pathToFakeFile = `${process.cwd()}/src/__tests__/support/fake_directory/test2/real-microservice/real.c`;

    it("should return the expected length of compose related files", async () => {
      const result = await pathSearcher({
        pathToInitialFile: pathToFakeFile,
        numberOfDirsFromCurrent: 2,
      });

      expect(result.searchedDirs).toEqual(24);
    });
  });
});
