import Bookshelf from 'bookshelf';

export function getObjectExtraModel(bookshelf: Bookshelf) {
  class ObjectExtraModel extends bookshelf.Model<any> {
    get tableName() {
      return 'object_extra';
    }
  }
  return ObjectExtraModel;
}

export const ObjectExtra = {
  tableName: 'character_extra'
}

export interface IObjectExtra {
  object_id: string,
  key: string,
  value: string
}

export interface IObjectExtraRead extends IObjectExtra {
  id: string
}
