import { Knex } from 'knex';

import { modelFactory, ModelName } from './models';
import { migrations, createMigrationTable, Migration } from './migrations/migrations';
import { IConfig } from './models/Config';
import { ICharacter } from './models/Character';

export function runSingleMigration(connection: Knex, migration: Migration): Promise<void> {
  return new Promise((resolve, reject) => {
    migration.up(connection).then(() => {
      const KnexMigration = modelFactory(connection).getModel(ModelName.Migration);
      if(KnexMigration) {
        KnexMigration.where({
          name: migration.name
        }).fetch({ require: false }).then((result: any) => {
          if(!result) {
            
            connection(KnexMigration.tableName).insert({
              name: migration.name
            }).then(() => {
              resolve();
            });
          } else {
            resolve();
          }
        }).catch((error: any) => {
          reject(error)
        })
      } else {
        resolve();
      }
    })
  });
}

export function getExistedMigrations(connection: Knex): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const KnexMigration = modelFactory(connection).getModel(ModelName.Migration);
    if(KnexMigration) {
      KnexMigration.fetchAll().then(result => {
        const migrationNames: string[] = [];
        result.forEach(item => {
          if(item.get('name')) {
            migrationNames.push(item.get('name'));
          }
        })
        resolve(migrationNames);
      })
    } else {
      resolve([]);
    }
  });
}

export function runMigrations(connection: Knex) {
  return new Promise((resolve) => {
    createMigrationTable(connection).then(() => {
      getExistedMigrations(connection).then(names => {
        const runMigrationPromises: Promise<void>[] = [];
        migrations.forEach(migration => {
          if(!names.includes(migration.name)) {
            runMigrationPromises.push(runSingleMigration(connection, migration))
          }
        });
        Promise.all(runMigrationPromises).then(() => {
          resolve(true);
        });
      })
    })
  });
}

export function runSeeder(connection: Knex): Promise<void> {
  return connection<ICharacter>('character').insert([
    {
      name: 'Character 1',
      alias: 'character_1',
      description: 'This is the first character 1',
      hint: 'Hint for character 1'
    },
    {
      name: 'Character 2',
      alias: 'character_2',
      description: 'This is the first character 2',
      hint: 'Hint for character 2'
    }
  ])
}

export function initConfig(connection: Knex, project: string, author: string): Promise<void> {
  return connection<IConfig>('config').insert([
    {
      key: 'project',
      title: 'Project',
      value: project
    },
    {
      key: 'author',
      title: 'Author',
      value: author
    },
  ])
}
