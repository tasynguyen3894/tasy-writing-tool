export const Migration = {
  tableName: 'chapter'
}

export enum Status {
  PUBLISH = 'publish',
  DRAFT = 'draft',
  HIDE = 'hide'
}

export interface IChapter {
  title: string,
  status: string,
  description?: string,
  tags?: string[],
  content: string,
  parent_id?: string,
  order?: number | undefined
}

export interface IChapterRead extends IChapter {
  id: string
}

export type IChapterCreate = Omit<IChapter, 'tags'> & {
  tags?: string
}

export type IChapterUpdate = Partial<IChapterCreate>;

export interface IChapterAfterCreated extends IChapterCreate {
  id: string
}

export type IChapterReadItem = IChapterRead;
