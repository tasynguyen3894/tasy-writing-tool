export const Migration = {
  tableName: 'group'
}

export interface IGroup {
  title: string,
  description: string,
  parent_id?: string[],
}

export interface IGroupRead extends IGroup {
  id: string
}

export type IGroupCreate = IGroup;

export type IGroupUpdate = Partial<IGroupCreate>;

