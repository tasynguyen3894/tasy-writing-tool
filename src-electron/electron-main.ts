import { app, BrowserWindow, nativeTheme, ipcMain, dialog } from 'electron';
import path from 'path';
import os from 'os';

import { selectProject, projectIsSetup, setup, getProjectData } from './services/project';
import { selectExportDirectory } from './services/export';
import { ApiHandler } from './services/api';
import { get, set, remove } from './services/storage';

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();



try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(
      path.join(app.getPath('userData'), 'DevTools Extensions')
    );
  }
} catch (_) {}

let mainWindow: BrowserWindow | undefined;

// ipcMain.handle('ping', () => {
//   return new Promise((resolve, reject) => {
//     database.all('select * from demo', (error, rows) => {
//       if(!error) {
//         resolve(rows)
//       } else {
//         reject(error)
//       }
//     })
//   })
// })

type ProjectEvent = {
  type: 'select' | 'detect' | 'setup' | 'getData';
  payload?: any
}

type StorageEvent = {
  type: 'get' | 'set' | 'remove'
  payload: {
    key: string,
    value?: any
  }
}

type ApiEvent = {
  path: string,
  method: string,
  payload: object
}

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  mainWindow.loadURL(process.env.APP_URL);

  ipcMain.handle('storage', (event, e: StorageEvent) => {
    if(e.type === 'get') {
      return get(e.payload.key);
    }

    if(e.type === 'set') {
      return set(e.payload.key, e.payload.value || '');
    }
  
    if(e.type === 'remove') {
      return remove(e.payload.key);
    }
  });

  ipcMain.handle('export', (event, e: any) => {
    return selectExportDirectory(mainWindow);
  })

  ipcMain.handle('project', (event, e: ProjectEvent) => {
    if(e.type === 'select') {
      return selectProject(mainWindow);
    }

    if(e.type === 'detect' && e.payload.path) {
      return projectIsSetup(e.payload.path)
    }

    if(e.type === 'setup' && e.payload.path && e.payload.project && e.payload.author) {
      return setup(e.payload.path, e.payload.project, e.payload.author);
    }

    if(e.type === 'getData' && e.payload.path) {
      return getProjectData(e.payload.path);
    }
  });

  ipcMain.handle('api', (event, e: ApiEvent) => {
    if(e.path && e.method && e.payload) {
      return ApiHandler(e.path, e.method, e.payload)
    }
  })

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.closeDevTools();
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === undefined) {
    createWindow();
  }
});
