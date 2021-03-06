import { getComposePaths } from "./index";
import { mockLogger } from "../../__mocks__/helpers/logger";

describe("pathSearcher", () => {
   describe("i'm passing in an absolute path to a file", () => {
      const pathToFakeFile = `${process.cwd()}/src/__mocks__/support/fake_directory/test2/real-microservice/real.c`;

      it("should return the expected length of compose related files and be reasonably fast", async () => {
         const result = await getComposePaths({
            pathToInitialFile: pathToFakeFile,
            numberOfDirsFromCurrent: 2,
            logger: mockLogger,
         });

         expect(result?.timeTakenMs).toBeLessThan(20); // ms
         expect(result?.searchedDirs).toEqual(21);
         expect(result?.composePaths.length).toEqual(15);
      });

      it("should not include ignored directory results in query", async () => {
         const result = await getComposePaths({
            pathToInitialFile: pathToFakeFile,
            numberOfDirsFromCurrent: 2,
            directoriesToIgnore: ["real-microservice", "node_modules"],
            logger: mockLogger,
         });

         expect(result?.timeTakenMs).toBeLessThan(20); // ms
         expect(result?.searchedDirs).toEqual(20);
         expect(result?.composePaths.length).toEqual(14);
      });

      it("should return an error if dirs from current lands on ignored directory", async () => {
         try {
            await getComposePaths({
               pathToInitialFile: pathToFakeFile,
               numberOfDirsFromCurrent: 2,
               directoriesToIgnore: ["support"],
               logger: mockLogger,
            });
         } catch (err) {
            expect(err).toEqual(
               new Error(
                  "Number of dirs from current leads to an ignored directory"
               )
            );
         }
      });
   });
});
