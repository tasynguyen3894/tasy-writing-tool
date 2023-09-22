export const Config = {
  tableName: 'config'
}

export enum ConfigKey {
  project = 'project',
  author = 'author'
}

export interface IConfig {
  key: string,
  title: string,
  value: string
}

export interface IConfigRead extends IConfig {
  id: string
}
