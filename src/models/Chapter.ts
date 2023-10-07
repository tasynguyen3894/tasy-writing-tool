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
  content: string
}

export interface IChapterRead extends IChapter {
  id: string
}

export type IChapterCreate = IChapter

export type IChapterUpdate = Partial<IChapterCreate>;

export interface IChapterAfterCreated extends Omit<IChapterCreate, 'tags'> {
  id: string,
  tags?: string
}

export type IChapterReadItem = IChapterRead;
