import Bookshelf from 'bookshelf';

import { ICharacterExtraRead } from './CharacterExtra';

export function getChapterModel(bookshelf: Bookshelf) {
  class ChapterModel extends bookshelf.Model<any> {
    get tableName() {
      return 'chapter';
    }
  }
  return ChapterModel;
}

export interface IChapter {
  title: string,
  status: string,
  description?: string,
  tags?: string[],
  content: string,
  metas?: ICharacterExtraRead[]
}

export interface IChapterRead extends IChapter {
  id: string
}

export type IChapterReadItem = Omit<IChapterRead, 'content'>;
