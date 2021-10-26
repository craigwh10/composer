import React from "react";
import { render, screen } from "@testing-library/react";

import { InfoBox } from "../../components/InfoBox";

// Example test :)
test("will be removed", () => {
   render(<InfoBox type={"info"}>Test</InfoBox>);

   const query = screen.getByText("Test");

   expect(query).toBeInTheDocument();
});
