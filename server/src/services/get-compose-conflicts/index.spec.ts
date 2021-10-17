import { getComposeConflicts } from "./index";

describe("getComposeConflicts", () => {
  describe("when passing in an array of accessible compose files", () => {
    it("should return expected conflicts of repeated images", async () => {
      const result = await getComposeConflicts({
        composePaths: [
          "/Users/craigwhite/Desktop/Fun_Projects/DependencyRunnerProject/server/src/__mocks__/support/fake_directory/test/dir1/deeperdir1/docker-compose.yml",
          "/Users/craigwhite/Desktop/Fun_Projects/DependencyRunnerProject/server/src/__mocks__/support/fake_directory/test/dir1/deeperdir2/docker-compose.yml",
        ],
      });

      // 3 conflicting images between compose files.
      expect(result.length).toEqual(3);
    });

    it("should return expected conflicts of repeated images", async () => {
      const result = await getComposeConflicts({
        composePaths: [
          "/Users/craigwhite/Desktop/Fun_Projects/DependencyRunnerProject/server/src/__mocks__/support/fake_directory/test/dir1/deeperdir1/docker-compose.yml",
          "/Users/craigwhite/Desktop/Fun_Projects/DependencyRunnerProject/server/src/__mocks__/support/fake_directory/test/dir1/deeperdir2/docker-compose.yml",
          "/Users/craigwhite/Desktop/Fun_Projects/DependencyRunnerProject/server/src/__mocks__/support/fake_directory/test/dir1/docker-compose.yml",
        ],
      });

      // 3 conflicting images between compose files.
      expect(result.length).toEqual(3);
    });
  });
});
