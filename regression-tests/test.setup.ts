// test.setup.ts
import {
   Before,
   BeforeAll,
   AfterAll,
   After,
   BeforeStep,
   setWorldConstructor,
   World,
} from "@cucumber/cucumber";
import { devices, chromium } from "playwright";
import { OurWorld } from "./types";
const { _electron: electron } = require("playwright");
import { setWorld, getWorld } from "./world";

BeforeAll(async function () {});
AfterAll(async function () {});
// Create a new test context and page per scenario
Before(async function (this: OurWorld) {
   const app = await electron.launch({
      args: ["../ui/public/electron-main.js"],
      timeout: 15000,
   });
   setWorld(app);
});
// Cleanup after each scenario
After(async function (this: OurWorld) {
   const app = getWorld();
   await app.close();
   setWorld(null);
});
