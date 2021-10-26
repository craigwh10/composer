/* eslint-disable */
const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const EventNames = require("../src/shared/EventNames");
const config = require("dotenv").config({
   path: path.resolve(__dirname, "../.env"),
});

const createWindow = () => {
   const mainWindow = new BrowserWindow({
      frame: true,
      webPreferences: {
         nodeIntegration: true,
         enableRemoteModule: true,
         contextIsolation: false,
         preload: __dirname + "/preload.js",
      },
   });

   mainWindow.loadURL(
      isDev
         ? `http://localhost:3005`
         : `file://${path.join(__dirname, "../build/index.html")}`
   );

   // mainWindow.webContents.openDevTools();

   ipcMain.handle(EventNames.OPEN_PATH_FINDER, async (event, arg) => {
      const { filePaths } = await dialog.showOpenDialog(mainWindow, {
         properties: ["openFile", "openDirectory"],
      });

      if (!filePaths) return null;

      return filePaths;
   });

   ipcMain.on("get-env", (event) => {
      event.sender.send("get-env-reply", config);
   });
};

app.on("ready", () => {
   createWindow();

   app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
   });
});

app.on("window-all-closed", () => {
   if (process.platform !== "darwin") app.quit();
});
