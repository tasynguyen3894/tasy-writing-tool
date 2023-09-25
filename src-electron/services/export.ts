import { BrowserWindow, dialog } from 'electron';

export function selectExportDirectory(mainWindow: BrowserWindow | undefined) {
  return new Promise((resolve, reject) => {
    if(mainWindow) {
      dialog.showOpenDialog(mainWindow, {
        properties: ['openFile', 'openDirectory']
      }).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    } else {
      reject('not found window');
    }
  });
}

