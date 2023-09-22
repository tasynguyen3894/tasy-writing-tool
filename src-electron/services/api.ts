import knex, { Knex } from 'knex';
import path from 'path';

import { CharacterApi } from './api/character';
import { ChapterApi } from './api/chapter';
import { ObjectApi } from './api/object';
import { GroupApi } from './api/group';
import { ConfigApi } from './api/config';
import { ICharacterExtraCreate } from 'src/models/CharacterExtra';
import { ICharacterCreate, ICharacterUpdate } from 'src/models/Character';
import { IChapterCreate, IChapterUpdate } from 'src/models/Chapter';
import { Routes } from 'src/models/Api'
import { IOBjectUpdate, IObjectCreate } from 'src/models/Object';
import { IObjectExtraCreate } from 'src/models/ObjectExtra';
import { IConfig } from 'src/models/Config';

export const CharacterMethods: string[] = [
  Routes.FetchCharacters,
  Routes.CreateCharacterExtra,
  Routes.RemoveCharacterExtra,
  Routes.CreateCharacter,
  Routes.RemoveCharacter,
  Routes.UpdateCharacter
];

export const ChapterMethods: string[] = [
  Routes.FetchChapters,
  Routes.CreateChapter,
  Routes.UpdateChapter,
  Routes.RemoveChapter,
];

export const ObjectMethods: string[] = [
  Routes.FetchObjects,
  Routes.CreateObject,
  Routes.UpdateObject,
  Routes.RemoveObject,
  Routes.CreateObjectExtra,
  Routes.RemoveObjectExtra
];

export const GroupMethods: string[] = [
  Routes.FetchGroups
];

export const ConfigMethods: string[] = [
  Routes.FetchConfig,
  Routes.CreateConfig,
  Routes.RemoveConfig
];

export class ApiRouter {
  private connection: Knex | null = null;

  constructor(connection: Knex) {
    this.connection = connection;
  }

  public runApi(method: string, payload: object): Promise<any> {
    if(this.connection) {
      return this.excute(this.connection, method, payload);
    }
    return Promise.resolve(null);
  }

  public excute(connection: Knex, method: string, payload: object): Promise<any> {
    return new Promise((resolve, rejects) => {
      let promise: Promise<any> = Promise.resolve(null)
      if(CharacterMethods.includes(method)) {
        const CharacterApiInstance = new CharacterApi(connection);
        if(method === Routes.FetchCharacters) {
          promise = CharacterApiInstance.fetch();
        }
        if(method === Routes.CreateCharacterExtra) {
          promise = CharacterApiInstance.createExtra(payload as { data: ICharacterExtraCreate });
        }
        if(method === Routes.CreateCharacter) {
          promise = CharacterApiInstance.create(payload as { data: ICharacterCreate });
        }
        if(method === Routes.RemoveCharacter) {
          promise = CharacterApiInstance.remove(payload as { id: string });
        }
        if(method === Routes.RemoveCharacterExtra) {
          promise = CharacterApiInstance.removeExtra(payload as { id: string });
        }
        if(method === Routes.UpdateCharacter) {
          promise = CharacterApiInstance.update(payload as { id: string, data: ICharacterUpdate });
        }
      }
      if(ChapterMethods.includes(method)) {
        const ChapterApiInstance = new ChapterApi(connection);
        if(method === Routes.FetchChapters) {
          promise = ChapterApiInstance.fetch();
        }
        if(method === Routes.CreateChapter) {
          promise = ChapterApiInstance.create(payload as { data: IChapterCreate });
        }
        if(method === Routes.RemoveChapter) {
          promise = ChapterApiInstance.remove(payload as { id: string });
        }
        if(method === Routes.UpdateChapter) {
          promise = ChapterApiInstance.update(payload as { id: string, data: IChapterUpdate });
        }
      }
      if(ObjectMethods.includes(method)) {
        const ObjectApiInstance = new ObjectApi(connection);
        if(method === Routes.FetchObjects) {
          promise = ObjectApiInstance.fetch();
        }
        if(method === Routes.CreateObject) {
          promise = ObjectApiInstance.create(payload as { data: IObjectCreate });
        }
        if(method === Routes.UpdateObject) {
          promise = ObjectApiInstance.update(payload as { id: string, data: IOBjectUpdate });
        }
        if(method === Routes.RemoveObject) {
          promise = ObjectApiInstance.remove(payload as { id: string });
        }
        if(method === Routes.CreateObjectExtra) {
          promise = ObjectApiInstance.createExtra(payload as { data: IObjectExtraCreate });
        }
        if(method === Routes.RemoveObjectExtra) {
          promise = ObjectApiInstance.removeExtra(payload as { id: string });
        }
      }
      if(GroupMethods.includes(method)) {
        const GroupApiInstance = new GroupApi(connection);
        if(method === Routes.FetchGroups) {
          promise = GroupApiInstance.fetch();
        }
      }
      if(ConfigMethods.includes(method)) {
        const ConfigApiInstance = new ConfigApi(connection);
        if(method === Routes.FetchConfig) {
          promise = ConfigApiInstance.fetch();
        }
        if(method === Routes.CreateConfig) {
          promise = ConfigApiInstance.create(payload as { data: IConfig });
        }
        if(method === Routes.RemoveConfig) {
          promise = ConfigApiInstance.remove(payload as { id: string });
        }
      }
      promise.then(result => {
        connection.destroy();
        resolve(result)
      })
    })
  }
}

export function ApiHanlder(projectPath: string, method: string, payload: object): Promise<any> {
  const connection = knex({
    client: 'sqlite',
    connection: {
      filename: path.resolve(projectPath, 'db.sqlite')
    }
  });

  const apiRouterInstance = new ApiRouter(connection);
  return apiRouterInstance.runApi(method, payload);
}
