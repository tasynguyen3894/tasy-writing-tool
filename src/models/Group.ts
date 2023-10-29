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
  chapters: {
    id: string,
    order: number | null
  }[]
}

export type IGroupCreate = IGroup;

export type IGroupUpdate = Partial<IGroupCreate>;

