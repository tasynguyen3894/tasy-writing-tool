import Bookshelf from 'bookshelf';

export function getConfigModel(bookshelf: Bookshelf) {
  class ConfigModel extends bookshelf.Model<any> {
    get tableName() {
      return 'config';
    }
  }
  return ConfigModel;
}

export interface IConfig {
  key: string,
  title: string,
  value: string
}

export interface IConfigRead extends IConfig {
  id: string
}
