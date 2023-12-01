import Bookshelf from 'bookshelf';

import { getChapterModel } from './Chapter';

export function getGroupChapterModel(bookshelf: Bookshelf) {
  class GroupChapterModel extends bookshelf.Model<any> {
    get tableName() {
      return 'group_chapter';
    }
    chapter() {
      return this.belongsTo(getChapterModel(bookshelf))
    }
  }
  return GroupChapterModel;
}
