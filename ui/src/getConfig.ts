/**
 * Get environment variables from .env inside react app.
 */
export async function getConfig() {
   const { ipcRenderer } = window.require("electron");
   let config: { [key: string]: string } = {};
   ipcRenderer.on("get-env-reply", (event: any, arg: any) => {
      config = arg.parsed;
   });
   ipcRenderer.send("get-env");

   return config;
}
