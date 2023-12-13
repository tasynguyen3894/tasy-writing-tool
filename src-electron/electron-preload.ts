/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.ts you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */
const { contextBridge, ipcRenderer } = require('electron');
const { setupPreload } = require('src/update/electron/preload');

contextBridge.exposeInMainWorld(
  'electron', {
   ping: () => ipcRenderer.invoke('ping')
  }
)

setupPreload(contextBridge, ipcRenderer);

contextBridge.exposeInMainWorld(
  'Native', {
   project: (args: any) => ipcRenderer.invoke('project', args),
   api: (args: any) => ipcRenderer.invoke('api', args),
   export: () => ipcRenderer.invoke('export'),
   exportGroup: () => ipcRenderer.invoke('export_group')
  }
);

contextBridge.exposeInMainWorld(
  'Store', {
   run: (args: any) => ipcRenderer.invoke('storage', args)
  }
)

contextBridge.exposeInMainWorld('UpdateVerion', {
  updateMessage: (callback: any) => {
    ipcRenderer.on('updateMessage', callback);
  }
});
