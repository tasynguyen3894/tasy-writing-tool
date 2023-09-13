export interface IObjectExtra {
  object_id: string,
  key: string,
  value: string
}

export interface IObjectExtraRead extends IObjectExtra {
  id: string
}
