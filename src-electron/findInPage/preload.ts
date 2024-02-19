const ELECONTRON_WINDOW_KEY = 'SearchInPage';

const EVENT_INVOKE_KEY = 'SEARCH_IN_PAGE_KEY';

export function setupSearchInPagePreload(context: Electron.ContextBridge, ipcRenderer: Electron.IpcRenderer) {
  context.exposeInMainWorld(ELECONTRON_WINDOW_KEY, {
    [EVENT_INVOKE_KEY](args: any) {
      return ipcRenderer.invoke(EVENT_INVOKE_KEY, args);
    }
  });
}
