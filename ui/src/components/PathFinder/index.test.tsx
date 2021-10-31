import React from "react";
import { fireEvent, screen } from "@testing-library/react";

// Target
import { PathFinder } from "./index";

// Mocked
import { renderWithFilePathContextAndQueryClient } from "../../__mocks__/context/FilePathProvider";

import * as hookCompose from "../../hooks/useComposePaths";

describe("<PathFinder/>", () => {
   let useCompose: jest.SpyInstance;
   let useConflictYml: jest.SpyInstance;

   describe("When there are compose paths returned", () => {
      let getComposePathsByPath = jest.fn();
      beforeEach(() => {
         useCompose = jest.spyOn(hookCompose, "useComposePaths");

         useCompose.mockReturnValue({
            data: { composePaths: ["test/path"] },
            getComposePathsByPath,
         });

         renderWithFilePathContextAndQueryClient(
            <PathFinder />,
            { filePath: "test/path", setFilePath: () => {} },
            true
         );
      });

      afterEach(() => {
         jest.resetAllMocks();
      });

      it("should shorten the path as you increase the search depth", () => {
         const searchDepthInput = screen.getByTestId("pathFinder-searchDepth");

         expect(searchDepthInput).toBeInTheDocument();

         fireEvent.input(searchDepthInput, { target: { value: 1 } });

         const shortenedPath = screen.getByTestId("pathFinder-searchResult");

         expect(shortenedPath).toHaveTextContent("test");
      });

      it("should get compose paths from the path when searching for compose files", () => {
         const searchDepthInput = screen.getByTestId("pathFinder-searchDepth");

         expect(searchDepthInput).toBeInTheDocument();

         fireEvent.input(searchDepthInput, { target: { value: 1 } });

         const searchComposeButton = screen.getByRole("button");

         expect(searchComposeButton).toBeInTheDocument();

         fireEvent.click(searchComposeButton);

         expect(getComposePathsByPath).toHaveBeenCalledTimes(1);
         expect(getComposePathsByPath).toBeCalledWith({
            searchPath: "test/path",
            directoriesFromInitial: 1,
         });
      });

      it("should not let you go beyond the root directory", () => {
         const searchDepthInput = screen.getByTestId("pathFinder-searchDepth");

         expect(searchDepthInput).toBeInTheDocument();

         fireEvent.input(searchDepthInput, { target: { value: 3 } });

         const shortenedPath = screen.getByTestId("pathFinder-searchResult");

         expect(shortenedPath).toHaveTextContent("test");
      });
   });

   describe("When there are no compose paths returned", () => {
      beforeEach(() => {
         useCompose = jest.spyOn(hookCompose, "useComposePaths");

         useCompose.mockReturnValue({ data: null });

         renderWithFilePathContextAndQueryClient(
            <PathFinder />,
            { filePath: "test/path", setFilePath: () => {} },
            true
         );
      });

      afterEach(() => {
         jest.resetAllMocks();
      });

      it("should shorten the path as you increase the search depth", () => {
         const searchDepthInput = screen.getByTestId("pathFinder-searchDepth");

         expect(searchDepthInput).toBeInTheDocument();

         fireEvent.input(searchDepthInput, { target: { value: 1 } });

         const composeResult = screen.getByTestId(
            "pathFinder-emptyComposeResult"
         );

         expect(composeResult).toBeInTheDocument();
         expect(composeResult).toHaveTextContent("");
      });

      it("should let you click the search compose file button", () => {
         const searchComposeButton = screen.getByRole("button");

         expect(searchComposeButton).toBeInTheDocument();
         expect(searchComposeButton).not.toBeDisabled();
      });
   });

   describe("When there is no file path", () => {
      beforeEach(() => {
         useCompose = jest.spyOn(hookCompose, "useComposePaths");

         useCompose.mockReturnValue({ data: null });

         renderWithFilePathContextAndQueryClient(
            <PathFinder />,
            { filePath: null, setFilePath: () => {} },
            true
         );
      });

      afterEach(() => {
         jest.resetAllMocks();
      });

      it("should not let you click the search compose file button", () => {
         const searchComposeButton = screen.getByRole("button");

         expect(searchComposeButton).toBeInTheDocument();
         expect(searchComposeButton).toBeDisabled();
      });
   });

   describe("When the compose paths are loading", () => {
      beforeEach(() => {
         useCompose = jest.spyOn(hookCompose, "useComposePaths");

         useCompose.mockReturnValue({ data: null, isLoading: true });

         renderWithFilePathContextAndQueryClient(
            <PathFinder />,
            { filePath: null, setFilePath: () => {} },
            true
         );
      });

      afterEach(() => {
         jest.resetAllMocks();
      });

      it("should display loading state on the button", () => {
         const searchComposeButton = screen.getByRole("button");

         expect(searchComposeButton).toBeInTheDocument();
         expect(searchComposeButton).toBeDisabled();
         expect(searchComposeButton).toHaveTextContent("Loading results...");
      });
   });
});
