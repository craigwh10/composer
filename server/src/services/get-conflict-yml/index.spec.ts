import { getConflictYml } from "./index";
import { mockLogger } from "../../__mocks__/helpers/logger";

describe("getComposeConflicts", () => {
   describe("when passing in an array of accessible compose files", () => {
      it("should return expected conflicts of repeated images", async () => {
         const result = await getConflictYml({
            composePaths: [
               `${process.cwd()}/src/__mocks__/support/fake_directory/test/dir1/deeperdir1/docker-compose.yml`,
               `${process.cwd()}/src/__mocks__/support/fake_directory/test/dir1/deeperdir2/docker-compose.yml`,
            ],
            logger: mockLogger,
         });

         // Same yml
         expect(result.ymlResult.length).toEqual(385);
      });

      it("should return expected conflicts of repeated images", async () => {
         const result = await getConflictYml({
            composePaths: [
               `${process.cwd()}/src/__mocks__/support/fake_directory/test/dir1/deeperdir1/docker-compose.yml`,
               `${process.cwd()}/src/__mocks__/support/fake_directory/test/dir1/deeperdir2/docker-compose.yml`,
               `${process.cwd()}/src/__mocks__/support/fake_directory/test/dir1/docker-compose.yml`,
            ],
            logger: mockLogger,
         });

         // Same yml
         expect(result.ymlResult.length).toEqual(385);
      });
   });
});
