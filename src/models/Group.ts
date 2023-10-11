export const Migration = {
  tableName: 'group'
}

export interface IGroup {
  title: string,
  description: string,
  parent_id?: string
}

export interface IGroupReadDB extends IGroup {
  id: string
}
export interface IGroupRead extends IGroupReadDB {
  chapterIds: string[]
}

export type IGroupCreate = IGroup;

export type IGroupUpdate = Partial<IGroupCreate>;

