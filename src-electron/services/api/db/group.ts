import { Knex } from 'knex';

import { modelFactory, ModelName } from 'src-electron/services/models';
import { IGroupReadDB } from 'src/models/Group';
import { IGroupChapterRead } from 'src/models/GroupChapter';

export function getGroup(connection: Knex, id: string, joins: 'chapters' | 'chapterIds'[] = []): Promise<IGroupReadDB | undefined> {
  const GroupModel = modelFactory(connection).getModel(ModelName.Group);

  if(!GroupModel) {
    return Promise.resolve(undefined);
  }
  return new Promise((resolve, reject) => {
    GroupModel.where({ id }).fetch({ reuired: false, withRelated: joins }).then((group: any) => {
      if(group) {
        resolve({
          id: group.get('id'),
          title: group.get('title'),
          description: group.get('description')
        });
      } else {
        resolve(undefined)
      }
    }).catch((error: Error) => {
      reject(error)
    })
  });
}

export type FindGroupChapter = Partial<{
  group_id: string,
  chapter_id: string,
  order: number
}>

export function getGroupChapter(connection: Knex, options: FindGroupChapter): Promise<IGroupChapterRead | undefined> {
  const GroupChapterModel = modelFactory(connection).getModel(ModelName.GroupChapter);

  if(!GroupChapterModel) {
    return Promise.resolve(undefined);
  }
  
  return new Promise((resolve, reject) => {
    GroupChapterModel.where(options).fetch({ require: false }).then((groupChapter: any) => {
      if(groupChapter) {
        resolve({
          id: groupChapter.get('id'),
          group_id: groupChapter.get('group_id'),
          chapter_id: groupChapter.get('chapter_id'),
          order: groupChapter.get('order')
        });
      } else {
        resolve(undefined)
      }
    }).catch((error: Error) => {
      reject(error)
    })
  });
}


