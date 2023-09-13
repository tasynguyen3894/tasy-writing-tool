import { BrowserWindow, dialog } from 'electron';
import knex from 'knex';
import fs from 'fs';
import path from 'path';

import { runMigrations, initConfig, runSeeder } from './knexHelper';
import { IConfigRead } from './models/Config';
import { getAllConfig } from './api/config';

export function selectProject(mainWindow: BrowserWindow | undefined) {
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

export function projectIsSetup(projectPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    if(!fs.existsSync(path.resolve(projectPath, 'db.sqlite'))) {
      resolve(false);
    } else {
      if(!fs.existsSync(path.resolve(projectPath, 'manifest.json'))) {
        resolve(false);
      } else {
        resolve(true);
      }
    }
  });
}

export function setup(projectPath: string, project: string, author: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    Promise.all([
      setUpDatabase(projectPath, project, author),
      setUpManifest(projectPath, project, author)
    ]).then(() => {
      resolve(true);
    }).catch(error => reject(error))
  });
}

export function setUpManifest(projectPath: string, project: string, author: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    fs.writeFileSync(path.resolve(projectPath, 'manifest.json'), JSON.stringify({
      project,
      author
    }));
    resolve(true);
  });
}

export function setUpDatabase(projectPath: string, project: string, author: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const connection = knex({
      client: 'sqlite',
      connection: {
        filename: path.resolve(projectPath, 'db.sqlite')
      }
    });

    runMigrations(connection).then(() => {
      initConfig(connection, project, author).then(() => {
        runSeeder(connection).then(() => {
          resolve(true);
          connection.destroy();
        })
      })
    }).catch(error =>  reject(error));
  });
}

export function getProjectData(projectPath: string): Promise<IConfigRead[]> {
  return new Promise((resolve, reject) => {
    const connection = knex({
      client: 'sqlite',
      connection: {
        filename: path.resolve(projectPath, 'db.sqlite')
      }
    });
    getAllConfig(connection).then(res => {
      resolve(res);
    }).catch((error) => {
      reject(error);
    })
  });
}

