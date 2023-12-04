import { BrowserWindow, IpcMain } from 'electron';
import { AppUpdater } from 'electron-updater';

import { createDispatcher } from './dispatcher';
import { createUpdater } from './updater';
import { EventType, EVENT_INVOKE_KEY, HandlerType } from '../util/constant';

let isSetup = false;

export function setupAutoUpdate(autoUpdater: AppUpdater, appWindow: BrowserWindow, ipcMain: IpcMain, option: {
  autoUpdate: boolean
}) {
  if(!isSetup) {
    isSetup = true;
    // Register hook
    const dispatcher = createDispatcher(appWindow);
    const updater = createUpdater(autoUpdater);

    autoUpdater.on('update-available', () => {
      dispatcher.dispatch(EventType.updateAvailable);
    });

    autoUpdater.on('update-not-available', () => {
      dispatcher.dispatch(EventType.updateNotAvailable);
    });

    autoUpdater.on('update-downloaded', () => {
      dispatcher.dispatch(EventType.updateDownloaded);
    });

    autoUpdater.on('error', () => {
      dispatcher.dispatch(EventType.error);
    });

    ipcMain.handle(EVENT_INVOKE_KEY, (_, type: string) => {
      if(type === HandlerType.checkForUpdates) {
        return updater.checkForUpdates();
      }
      if(type === HandlerType.downloadUpdate) {
        return updater.downloadUpdates();
      }
    })
  }
}

