import Bookshelf from 'bookshelf';

export function getGroupModel(bookshelf: Bookshelf): Bookshelf.Model<any> {
  class GroupModel extends bookshelf.Model<any> {
    get tableName() {
      return 'group';
    }
  }
  return new GroupModel();
}

