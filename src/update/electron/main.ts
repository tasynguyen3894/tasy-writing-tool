import { BrowserWindow, IpcMain, dialog } from 'electron';
import { AppUpdater } from 'electron-updater';

import { createDispatcher, Dispatcher } from './dispatcher';
import { createUpdater } from './updater';
import { EventType, EVENT_INVOKE_KEY, HandlerType } from '../util/constant';

export class ApplicationAutoUpdater {
  protected autoUpdater: AppUpdater;
  protected appWindow: BrowserWindow;
  protected ipcMain: IpcMain;
  protected dispatcher: Dispatcher;

  constructor(autoUpdater: AppUpdater, appWindow: BrowserWindow, ipcMain: IpcMain) {
    this.autoUpdater = autoUpdater;
    this.appWindow = appWindow;
    this.ipcMain = ipcMain;
    this.dispatcher = createDispatcher(this.appWindow);
  }

  changeAppWindow(appWindow: BrowserWindow) {
    this.appWindow = appWindow;
    this.dispatcher = createDispatcher(appWindow);
  }
  
  setup() {
    const updater = createUpdater(this.autoUpdater);

    this.autoUpdater.on('update-available', () => {
      this.dispatcher.dispatch(EventType.updateAvailable);
    });

    this.autoUpdater.on('update-not-available', () => {
      this.dispatcher.dispatch(EventType.updateNotAvailable);
    });

    this.autoUpdater.on('update-downloaded', () => {
      this.dispatcher.dispatch(EventType.updateDownloaded);
    });

    this.autoUpdater.on('error', (info) => {
      this.dispatcher.dispatch(EventType.error, {
        message: info.message
      });
    });

    this.ipcMain.handle(EVENT_INVOKE_KEY, (_, type: string) => {
      switch (type) {
        case HandlerType.checkForUpdates:
          return updater.checkForUpdates();
        case HandlerType.downloadUpdate:
          return updater.downloadUpdates();
        case HandlerType.quitAndInstall:
          return updater.quitAndInstall();
        default:
          break;
      }
    })
  }
}
