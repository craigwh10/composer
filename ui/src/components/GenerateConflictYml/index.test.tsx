import React, { ReactElement } from "react";
import { render, screen } from "@testing-library/react";

// Target
import { GenerateConflictYml } from "./index";

// Mocked
import { renderWithFilePathContextAndQueryClient } from "../../__mocks__/context/FilePathProvider";

import * as hookCompose from "../../hooks/useComposePaths";
import * as hookConflict from "../../hooks/useConflictYml";

describe("<GenerateConflictYml/>", () => {
   let useCompose: jest.SpyInstance;
   let useConflictYml: jest.SpyInstance;

   describe("When index and index both return data", () => {
      beforeEach(() => {
         useCompose = jest.spyOn(hookCompose, "useComposePaths");
         useConflictYml = jest.spyOn(hookConflict, "useConflictYml");

         useCompose.mockReturnValue({ data: { composePaths: ["test/path"] } });
         useConflictYml.mockReturnValue({
            data: {
               ymlResult: "version: 3",
               timeTakenMs: 13,
               averageMemory: 3,
            },
         });

         renderWithFilePathContextAndQueryClient(
            <GenerateConflictYml type="docker-compose" />,
            { filePath: null, setFilePath: () => {} },
            true
         );
      });

      afterEach(() => {
         jest.resetAllMocks();
      });

      it("should render the yml code out", () => {
         const query = screen.getByTestId("generateconflictyml-docker-compose");
         const code = query.getElementsByTagName("code")[0];

         expect(code).toBeInTheDocument();
         expect(code.textContent).toEqual("version: 3");
      });
   });

   describe("When index and index dont return data", () => {
      beforeEach(() => {
         useCompose = jest.spyOn(hookCompose, "useComposePaths"); // spy on otherFn
         useConflictYml = jest.spyOn(hookConflict, "useConflictYml"); // spy on otherFn

         useCompose.mockReturnValue({ data: {} });
         useConflictYml.mockReturnValue({ data: {} });

         renderWithFilePathContextAndQueryClient(
            <GenerateConflictYml type="docker-compose" />,
            { filePath: null, setFilePath: () => {} },
            true
         );
      });

      afterEach(() => {
         jest.resetAllMocks();
      });

      it("should render the empty div for this component", () => {
         const emptyDiv = screen.getByTestId(
            "generateconflictyml-docker-compose-empty"
         );

         expect(emptyDiv).toBeInTheDocument();
      });
   });
});
