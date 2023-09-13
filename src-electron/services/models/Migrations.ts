import Bookshelf from 'bookshelf';

export function getMigrationModel(bookshelf: Bookshelf): any {
  class MigrationModel extends bookshelf.Model<any> {
    get tableName() {
      return 'knex_migrations';
    }
  }
  return new MigrationModel();
}
