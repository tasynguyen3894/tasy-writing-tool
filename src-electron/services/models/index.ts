import bookshelf from 'bookshelf';

import { getMigrationModel } from './Migrations';
import { getConfigModel } from './Config';
import { getCharacterModel } from './Character';
import { getChapterModel } from './Chapter';
import { getCharacterExtraModel } from './CharacterExtra';
import { getObjectExtraModel } from './ObjectExtra';
import { getObjectModel } from './Object';

export enum ModelName {
  Migration = 'Migration',
  Config = 'Config',
  Character = 'Character',
  Chapter = 'Chapter',
  CharacterExtra = 'CharacterExtra',
  Object = 'Object',
  ObjectExtra = 'ObjectExtra'
}

export interface ModelDefine {
  tableName: string
}

const Models: { [key: string]: (b: bookshelf) => any } = {
  [ModelName.Character]: getCharacterModel,
  [ModelName.CharacterExtra]: getCharacterExtraModel,
  [ModelName.Config]: getConfigModel,
  [ModelName.Chapter]: getChapterModel,
  [ModelName.Migration]: getMigrationModel,
  [ModelName.Object]: getObjectModel,
  [ModelName.ObjectExtra]: getObjectExtraModel,
}

export function modelFactory(connection: any) {
  const bookshelfConnection = bookshelf(connection);

  function getModel(name: ModelName, returnInstance = false): bookshelf.Model<any> | undefined {
    if(Models[name]) {
      return Models[name](bookshelfConnection);
    }
    return undefined
  }

  return {
    getModel
  }
}

