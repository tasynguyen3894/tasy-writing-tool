import { IObjectExtra } from './ObjectExtra';

export interface IObject {
  name: string,
  type: string,
  alias: string,
  hint?: string,
  description?: string,
  metas?: IObjectExtra[]
}

export interface IObjectRead extends IObject {
  id: string
}
