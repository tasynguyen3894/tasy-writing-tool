import Bookshelf from 'bookshelf';

import { ICharacterExtraRead } from './CharacterExtra';

export function getChapterModel(bookshelf: Bookshelf): Bookshelf.Model<any> {
  class ChapterModel extends bookshelf.Model<any> {
    get tableName() {
      return 'chapter';
    }
  }
  return new ChapterModel();
}

export interface IChapter {
  title: string,
  status: string,
  description?: string,
  tags?: string[],
  content: string,
  parent_id?: string,
  order: number,
  metas?: ICharacterExtraRead[]
}

export interface IChapterRead extends IChapter {
  id: string
}

export type IChapterReadItem = Omit<IChapterRead, 'content'>;
