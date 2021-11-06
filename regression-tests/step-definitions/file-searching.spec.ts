import { Given, When, Then } from "@cucumber/cucumber";
import { OurWorld } from "../types";
import { test, expect } from "@playwright/test";

import { ExplorerModule } from "../pageobjects/modules";
const { _electron: electron } = require("playwright");

import { getWorld } from "../world";
import { delay } from "../support/utils";

Given("I start on the explorer page", async function () {
   const app = getWorld();
   const window = await app.firstWindow();
   const explorer = new ExplorerModule(window);

   expect(await explorer.moduleExists()).toBe(true);
});

When(
   "I select a path with a compose file in range {string}",
   async (string) => {
      const app = getWorld();
      const window = await app.firstWindow();
      const explorer = new ExplorerModule(window);

      await explorer.enterFileData();
      await explorer.setSearchRange(string);
   }
);

Then("I click search compose files", async () => {
   const app = getWorld();
   const window = await app.firstWindow();
   const explorer = new ExplorerModule(window);

   await explorer.runComposeSearch();
});

Then("I get paths to {string} compose files", async (string) => {
   const app = getWorld();
   const window = await app.firstWindow();
   const explorer = new ExplorerModule(window);

   expect(await explorer.getComposeFileNumber()).toContain(string);
});

Then("I {string} get some conflict yml back", async (string) => {
   const app = getWorld();
   const window = await app.firstWindow();
   const explorer = new ExplorerModule(window);

   if (string === "do") {
      expect(await explorer.getConflictCode()).toContain("services");
   } else {
      expect(await explorer.isEmptyConflict()).toBe(true);
   }
});
