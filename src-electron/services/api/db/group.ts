import { Knex } from 'knex';

import { modelFactory, ModelName } from 'src-electron/services/models';
import { IGroupReadDB } from 'src/models/Group';
import { IGroupChapterRead } from 'src/models/GroupChapter';
import { IChapterRead } from 'src/models/Chapter';

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

export function getGroupChapters(connection: Knex, options: FindGroupChapter): Promise<Array<IGroupChapterRead & {
  chapter: IChapterRead    
}>> {
  const GroupChapterModel = modelFactory(connection).getModel(ModelName.GroupChapter);

  if(!GroupChapterModel) {
    return Promise.resolve([]);
  }
  
  return new Promise((resolve, reject) => {
    GroupChapterModel.where(options).fetchAll({ require: false, withRelated: ['chapter'] }).then((groupChapters: any) => {
      if(groupChapters.models.length > 0) {
        const result: Array<IGroupChapterRead & {
          chapter: IChapterRead    
        }> = [];
        groupChapters.models.forEach((item: any) => {
          const { id, content, title, status, description } = item.related('chapter').attributes;
          result.push({
            id: item.get('id'),
            group_id: item.get('group_id'),
            chapter_id: item.get('chapter_id'),
            order: item.get('order'),
            chapter: { id, content, title, status, description, tags: [] }
          })
        });
        resolve(result);
      } else {
        resolve([])
      }
    }).catch((error: Error) => {
      reject(error)
    })
  });
}
