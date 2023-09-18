import Bookshelf from 'bookshelf';

import { IObjectExtra, getObjectExtraModel } from './ObjectExtra';

export function getObjectModel(bookshelf: Bookshelf): Bookshelf.Model<any> {
  class ObjectModel extends bookshelf.Model<any> {
    get tableName() {
      return 'object';
    }
    metas() {
      return this.hasMany(getObjectExtraModel(bookshelf))
    }
  }
  return new ObjectModel();
}

export interface IObject {
  name: string,
  type: string,
  alias: string,
  description?: string,
  hint?: string,
  metas?: IObjectExtra[]
}

export interface IObjectRead extends IObject {
  id: string
}
