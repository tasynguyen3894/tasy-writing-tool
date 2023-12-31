import { IObjectExtraRead } from './ObjectExtra';

export interface IObject {
  name: string,
  type: string,
  alias: string,
  hint?: string,
  description?: string,
  metas?: IObjectExtraRead[]
}

export interface IObjectRead extends IObject {
  id: string
}

export type IObjectCreate = Omit<IObject, 'metas'>;

export type IOBjectUpdate = Partial<IObjectCreate>;
