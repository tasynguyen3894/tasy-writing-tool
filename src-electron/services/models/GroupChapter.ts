import Bookshelf from 'bookshelf';

export function getGroupChapterModel(bookshelf: Bookshelf) {
  class GroupChapterModel extends bookshelf.Model<any> {
    get tableName() {
      return 'group_chapter';
    }
  }
  return GroupChapterModel;
}
