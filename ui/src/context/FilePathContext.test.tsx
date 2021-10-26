import React, { ReactElement, useContext } from "react";
import FilepathProvider, { FilePathContext } from "./FilepathContext";
import { render, screen } from "@testing-library/react";

const customRender = (
   ui: ReactElement,
   providerProps: any,
   renderOptions?: any
) => {
   return render(
      <FilePathContext.Provider value={providerProps}>
         {ui}
      </FilePathContext.Provider>,
      renderOptions
   );
};

const MockElement = ({}): ReactElement => {
   const { filePath } = useContext(FilePathContext);

   return <div>filePath: {filePath}</div>;
};

describe("FilePathContext", () => {
   it("should render default value when default provider wrapper", () => {
      render(<MockElement />, { wrapper: FilepathProvider });

      expect(screen.getByText(/^filePath/)).toHaveTextContent("filePath:");
   });

   it("should show value from provider", () => {
      customRender(<MockElement />, { filePath: "filePath" });

      expect(screen.getByText(/^filePath/)).toHaveTextContent(
         "filePath: filePath"
      );
   });
});
