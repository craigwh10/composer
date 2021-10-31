import { renderTestHook } from "../../__mocks__/hooks/renderTestHook";
import { useComposePaths } from "./index";
import * as fetch from "../__utils__/fetchAsJson";
import { act } from "@testing-library/react-hooks";

describe("useComposePaths(chosenSearchPath: string)", () => {
   describe("when rendering with correct configs", () => {
      let fetchAsJson: jest.SpyInstance;

      beforeEach(() => {
         fetchAsJson = jest
            .spyOn(fetch, "fetchAsJson")
            .mockResolvedValue({ hi: "test" });
      });

      afterEach(() => {
         jest.resetAllMocks();
      });

      it("should initially be undefined as it is disabled other than for mutations", async () => {
         const { result } = await renderTestHook(useComposePaths, [
            "path/path",
         ]);

         expect(result.current.data).toEqual(undefined);
      });

      it("should return data from fetch when using getComposeByPath()", async () => {
         const { result, waitForNextUpdate } = await renderTestHook(
            useComposePaths,
            ["path/path"]
         );

         act(() => {
            result.current.getComposePathsByPath({ searchPath: "path" });
         });

         await waitForNextUpdate();

         expect(fetchAsJson).toBeCalledWith("compose-paths", [
            { name: "path", value: "path", valueIsPath: true },
            { isQuery: true, name: "depth", value: 5 },
         ]);
         expect(result.current.data).toEqual({ hi: "test" });
      });

      // Can't test error returns even after following:
      // https://github.com/tannerlinsley/react-query/issues/859
      // Which affects branch coverage.
   });
});
