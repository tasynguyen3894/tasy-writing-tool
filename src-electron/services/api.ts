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
import { IConfigCreate } from 'src/models/Config';
import { IGroupCreate, IGroupUpdate } from 'src/models/Group';

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
  Routes.ExportChapter
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
  Routes.FetchGroups,
  Routes.CreateGroup,
  Routes.RemoveGroup,
  Routes.UpdateGroup,
  Routes.GroupAddChapter,
  Routes.GroupRemoveChapter
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
    if(CharacterMethods.includes(method)) {
      const CharacterApiInstance = new CharacterApi(connection);
      switch (method) {
        case Routes.FetchCharacters:
          return CharacterApiInstance.fetch();
        
        case Routes.CreateCharacterExtra:
          return CharacterApiInstance.createExtra(payload as { data: ICharacterExtraCreate });
        
        case Routes.CreateCharacter:
          return CharacterApiInstance.create(payload as { data: ICharacterCreate });
        
        case Routes.RemoveCharacter:
          return CharacterApiInstance.remove(payload as { id: string });
        
        case Routes.RemoveCharacterExtra:
          return CharacterApiInstance.removeExtra(payload as { id: string });
        
        case Routes.UpdateCharacter:
          return CharacterApiInstance.update(payload as { id: string, data: ICharacterUpdate });
      }
    }
    if(ChapterMethods.includes(method)) {
      const ChapterApiInstance = new ChapterApi(connection);
      switch (method) {
        case Routes.FetchChapters:
          return ChapterApiInstance.fetch();
        
        case Routes.CreateChapter:
          return ChapterApiInstance.create(payload as { data: IChapterCreate });
        
        case Routes.RemoveChapter:
          return ChapterApiInstance.remove(payload as { id: string });
        
        case Routes.UpdateChapter:
          return ChapterApiInstance.update(payload as { id: string, data: IChapterUpdate });
        
        case Routes.ExportChapter:
          return ChapterApiInstance.export(payload as { id: string, pathExport: string });
      }
    }
    if(ObjectMethods.includes(method)) {
      const ObjectApiInstance = new ObjectApi(connection);
      switch (method) {
        case Routes.FetchObjects:
          return ObjectApiInstance.fetch();
        
        case Routes.CreateObject:
          return ObjectApiInstance.create(payload as { data: IObjectCreate });
        
        case Routes.UpdateObject:
          return ObjectApiInstance.update(payload as { id: string, data: IOBjectUpdate });
        
        case Routes.RemoveObject:
          return ObjectApiInstance.remove(payload as { id: string });
        
        case Routes.CreateObjectExtra:
          return ObjectApiInstance.createExtra(payload as { data: IObjectExtraCreate });
        
        case Routes.RemoveObjectExtra:
          return ObjectApiInstance.removeExtra(payload as { id: string });
      }
    }
    if(GroupMethods.includes(method)) {
      const GroupApiInstance = new GroupApi(connection);
      switch (method) {
        case Routes.FetchGroups:
          return GroupApiInstance.fetch();
        
        case Routes.CreateGroup:
          return GroupApiInstance.create(payload as { data: IGroupCreate });
        
        case Routes.UpdateGroup:
          return GroupApiInstance.update(payload as { data: IGroupUpdate, id: string });
        
        case Routes.RemoveGroup:
          return GroupApiInstance.remove(payload as { id: string });

        case Routes.GroupAddChapter:
          return GroupApiInstance.addChapter(payload as { groupId: string, chapterId: string });

        case Routes.GroupRemoveChapter:
          return GroupApiInstance.removeChapter(payload as { groupId: string, chapterId: string });
      }
    }
    if(ConfigMethods.includes(method)) {
      const ConfigApiInstance = new ConfigApi(connection);
      switch (method) {
        case Routes.FetchConfig:
          return ConfigApiInstance.fetch();
        
        case Routes.CreateConfig:
          return ConfigApiInstance.create(payload as { data: IConfigCreate });
        
        case Routes.RemoveConfig:
          return ConfigApiInstance.remove(payload as { id: string });
      }
    }
    return Promise.resolve(null)
  }
}

export function ApiHandler(projectPath: string, method: string, payload: object): Promise<any> {
    const connection = knex({
    client: 'sqlite',
    connection: {
      filename: path.resolve(projectPath, 'db.sqlite')
    }
  });

  return new Promise((resolve, reject) => {
    const apiRouterInstance = new ApiRouter(connection);
    apiRouterInstance.runApi(method, payload).then(result => {
      connection.destroy();
      resolve(result);
    }).catch(error => {
      reject(error);
    })
  });
}
