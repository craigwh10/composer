import React from "react";
import { fireEvent, screen } from "@testing-library/react";

// Target
import { FileSearcher } from "./index";

// Mocked
import { renderWithFilePathContextAndQueryClient } from "../../__mocks__/context/FilePathProvider";
import { setupMockIpcRenderer } from "../../__mocks__/global";

describe("<FileSearcher/>", () => {
   describe("When not working under regression test env", () => {
      let ipcRendererInvoke: jest.Mock;
      let setFilePath: jest.Mock;

      beforeEach(() => {
         setFilePath = jest.fn();
         ipcRendererInvoke = jest.fn().mockResolvedValue([""]);

         setupMockIpcRenderer(ipcRendererInvoke);

         renderWithFilePathContextAndQueryClient(<FileSearcher />, {
            filePath: null,
            setFilePath: setFilePath,
         });
      });

      afterAll(() => {
         jest.resetAllMocks();
      });

      it("should call ipcRender invoke on click and set the file path", (done) => {
         const query = screen.getByTestId("directorySelect-button");
         expect(query).toBeInTheDocument();
         expect(query.textContent).toBe("Select Directory");

         query.click();

         // To push assertions to end of event queue
         // otherwise promise doesn't resolve.
         // NOTE: REF: https://github.com/facebook/jest/issues/2157
         setTimeout(() => {
            expect(ipcRendererInvoke).toHaveBeenCalledTimes(1);
            expect(setFilePath).toHaveBeenCalledTimes(1);
            done();
         }, 0);
      });
   });

   describe("When working under regression test env", () => {
      let setFilePath: jest.Mock<any, any>;

      beforeEach(() => {
         setFilePath = jest.fn();

         Object.defineProperty(process, "env", {
            value: {
               REACT_APP_IS_TEST: "true",
            },
         });

         renderWithFilePathContextAndQueryClient(<FileSearcher />, {
            filePath: null,
            setFilePath: setFilePath,
         });
      });

      it("should change the file path as you change this regression specific input", () => {
         const hiddenInput = screen.getByTestId("directorySelect-hidden-input");

         expect(hiddenInput).toBeInTheDocument();

         fireEvent.input(hiddenInput, { target: { value: "hello" } });

         expect(setFilePath).toBeCalledWith("hello");
      });
   });
});
