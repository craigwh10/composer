/**
 * Can assert on global.fetch
 */
export const setupMockFetch = (result: any): void => {
   // TODO: Create better mock interface for this.
   // @ts-ignore
   global.fetch = jest.fn(() =>
      Promise.resolve({
         json: () => Promise.resolve(result),
      })
   );
};

/**
 * Can assert on window.ipcRenderer.invoke
 */
export const setupMockIpcRenderer = (ipcRendererInvoke: jest.Mock): void => {
   Object.defineProperty(window, "ipcRenderer", {
      value: {
         invoke: ipcRendererInvoke,
      },
   });
};
