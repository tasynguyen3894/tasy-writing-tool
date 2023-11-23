import { BrowserWindow, dialog } from 'electron';

export function selectExportDirectory(mainWindow: BrowserWindow | undefined) {
  return new Promise((resolve, reject) => {
    if(mainWindow) {
      dialog.showSaveDialog(mainWindow, {
        filters: [
          {
            name: 'Documents', extensions: ['docx']
          }
        ]
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

export function selectExportGroupDirectory(mainWindow: BrowserWindow | undefined) {
  return new Promise((resolve, reject) => {
    if(mainWindow) {
      dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
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

