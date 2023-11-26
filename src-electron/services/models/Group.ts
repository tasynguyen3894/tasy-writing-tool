import Bookshelf from 'bookshelf';

import { getGroupChapterModel } from './GroupChapter';
import { getChapterModel } from './Chapter';

export function getGroupModel(bookshelf: Bookshelf): Bookshelf.Model<any> {
  class GroupModel extends bookshelf.Model<any> {
    get tableName() {
      return 'group';
    }
    chapterIds() {
      return this.hasMany(getGroupChapterModel(bookshelf))
    }
    chapters() {
      return this.belongsToMany(getChapterModel(bookshelf), 'group_chapter')
    }
  }
  return new GroupModel();
}

