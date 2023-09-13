export const Config = {
  tableName: 'config'
}

export interface IConfig {
  key: string,
  title: string,
  value: string
}

export interface IConfigRead extends IConfig {
  id: string
}
