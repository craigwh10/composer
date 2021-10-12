const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const EventNames = require("../src/shared/EventNames");

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    frame: true,
    webPreferences: {
      devTools: isDev,
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  ipcMain.handle(EventNames.OPEN_PATH_FINDER, async (event, arg) => {
    const { filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ["openFile", "openDirectory"],
    });

    if (!filePaths) return null;

    return filePaths;
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
