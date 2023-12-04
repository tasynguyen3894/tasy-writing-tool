import { BrowserWindow } from 'electron';

import { ELECONTRON_WINDOW_KEY } from '../util/constant';

export function createDispatcher(appWindow: BrowserWindow) {
  return {
    dispatch(messageType: string) {
      appWindow.webContents.send(ELECONTRON_WINDOW_KEY, {
        type: messageType
      });
    }
  }
}
