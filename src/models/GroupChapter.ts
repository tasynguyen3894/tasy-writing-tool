export const Migration = {
  tableName: 'group_chapter'
}

export interface IGroupChapter {
  group_id: string,
  chapter_id: string,
  order: number
}

export interface IGroupChapterRead extends IGroupChapter {
  id: string
}

export type IGroupCreate = IGroupChapter;

export type IGroupUpdate = Partial<IGroupChapter>;

