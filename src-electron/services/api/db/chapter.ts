import { Knex } from 'knex';

import { modelFactory, ModelName } from 'src-electron/services/models';
import { IChapterReadItem } from 'src/models/Chapter';

export function getChapter(connection: Knex, id: string): Promise<IChapterReadItem | undefined> {
  const ChapterModel = modelFactory(connection).getModel(ModelName.Chapter);

  if(!ChapterModel) {
    return Promise.resolve(undefined);
  }
  
  return new Promise((resolve, reject) => {
    ChapterModel.where({ id }).fetch({ require: false }).then((chapter: any) => {
      if(chapter) {
        resolve({
          id: chapter.get('id'),
          title: chapter.get('title'),
          description: chapter.get('description'),
          content: chapter.get('content'),
          tags: chapter.get('tags').split(','),
          status: chapter.get('status')
        });
      } else {
        resolve(undefined)
      }
    }).catch((error: Error) => {
      reject(error)
    })
  });
}
