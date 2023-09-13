import Bookshelf from 'bookshelf';

export function getCharacterExtraModel(bookshelf: Bookshelf) {
  class CharacterExtraModel extends bookshelf.Model<any> {
    get tableName() {
      return 'character_extra';
    }
  }
  return CharacterExtraModel;
}

export const CharacterExtra = {
  tableName: 'character_extra'
}

export interface ICharacterExtra {
  character_id: string,
  key: string,
  value: string
}

export interface ICharacterExtraRead extends ICharacterExtra {
  id: string
}
