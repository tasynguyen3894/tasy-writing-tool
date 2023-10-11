import Bookshelf from 'bookshelf';

import { getGroupChapterModel } from './GroupChapter';

export function getGroupModel(bookshelf: Bookshelf): Bookshelf.Model<any> {
  class GroupModel extends bookshelf.Model<any> {
    get tableName() {
      return 'group';
    }
    chapters() {
      return this.hasMany(getGroupChapterModel(bookshelf))
    }
  }
  return new GroupModel();
}

