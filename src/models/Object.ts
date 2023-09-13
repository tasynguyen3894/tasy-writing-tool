import { IObjectExtra } from './ObjectExtra';

export interface IObject {
  name: string,
  type: string,
  description?: string,
  hint?: string,
  metas?: IObjectExtra[]
}

export interface IObjectRead extends IObject {
  id: string
}
