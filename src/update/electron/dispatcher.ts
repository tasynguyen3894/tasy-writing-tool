import { BrowserWindow } from 'electron';

import { EVENT_MESSAGE_KEY } from '../util/constant';

export type Dispatcher = {
  dispatch(type: string, value?: { [key: string]: any }): void
}

export function createDispatcher(appWindow: BrowserWindow): Dispatcher  {
  return {
    dispatch(messageType: string, value = {}) {
      appWindow.webContents.send(EVENT_MESSAGE_KEY, {
        type: messageType,
        value
      });
    }
  }
}
