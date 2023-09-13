import Bookshelf from 'bookshelf';

import { getCharacterExtraModel } from './CharacterExtra';
import { ICharacterExtraRead } from './CharacterExtra';

export function getCharacterModel(bookshelf: Bookshelf): Bookshelf.Model<any> {
  class CharacterModel extends bookshelf.Model<any> {
    get tableName() {
      return 'character';
    }
    metas() {
      return this.hasMany(getCharacterExtraModel(bookshelf))
    }
  }
  return new CharacterModel();
}

export interface ICharacter {
  name: string,
  alias: string,
  description?: string,
  hint?: string,
  metas?: ICharacterExtraRead[]
}

export interface ICharacterRead extends ICharacter {
  id: string
}
