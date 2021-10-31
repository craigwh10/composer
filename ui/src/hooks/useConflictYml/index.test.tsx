import { useConflictYml } from "./index";
import { renderTestHook } from "../../__mocks__/hooks/renderTestHook";
import * as fetch from "../__utils__/fetchAsJson";

describe("useConflictYml(chosenSearchPath: string)", () => {
   describe("when rendering with correct configs", () => {
      let fetchAsJson: jest.SpyInstance;

      beforeEach(() => {
         fetchAsJson = jest
            .spyOn(fetch, "fetchAsJson")
            .mockResolvedValue({ hi: ["test"] });
      });

      afterEach(() => {
         jest.resetAllMocks();
      });

      it("should return the conflicts on initial render", async () => {
         const { result, waitForNextUpdate } = await renderTestHook(
            useConflictYml,
            ["path/path"]
         );

         await waitForNextUpdate();

         expect(result.current.data).toEqual({ hi: ["test"] });
      });

      it("should return undefined if no path provided", async () => {
         const { result, waitForNextUpdate } = await renderTestHook(
            useConflictYml,
            []
         );

         await waitForNextUpdate();

         expect(fetchAsJson).not.toBeCalled();

         expect(result.current.data).toEqual(undefined);
      });
   });
});
