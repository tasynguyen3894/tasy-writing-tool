import { IGroupRead, IGroupCreate, IGroupUpdate, IGroupReadDB } from 'src/models/Group';
import { modelFactory, ModelName } from '../models';
import { BaseApi } from './base';
import { getChapter } from './db/chapter';
import { getGroup } from './db/group';
import { IGroupChapterRead } from 'src/models/GroupChapter';

export class GroupApi extends BaseApi {
  public create(payload: {
    data: IGroupCreate
  }): Promise<IGroupRead | boolean> {
    return new Promise((resolve) => {
      if(this.connection) {
        const { data } = payload;
        this.connection('group').insert(data, ['id', 'title', 'description', 'parent_id'])
          .then((result: IGroupRead[])  => {
            if(result.length > 0) {
              resolve(result[0])
            } else {
              resolve(false)
            }
          }).catch(e => {
            console.log(e)
          })
      } else {
        resolve(false);
      }
    })
  }

  public remove(data: { id: string }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if(this.connection) {
        const connection = this.connection;
        connection('group')
            .where('id', data.id)
            .del()
            .then(() => {
              resolve(true)
            }).catch(error => {
              reject(error);
            });
      } else {
        resolve(false);
      }
    })
  }

  public update(payload: {
    data: IGroupUpdate,
    id: string
  }): Promise<IGroupReadDB | false> {
    return new Promise((resolve) => {
      const GroupModel = modelFactory(this.connection).getModel(ModelName.Group);
      if(GroupModel) {
        const { data, id } = payload;
        GroupModel
          .where({
            id
          })
          .fetch({ require: false })
          .then((existedGroup: any) => {
            if(existedGroup) {
              existedGroup.save(data).then(() => {
                resolve({
                  id,
                  title: data.title || existedGroup.get('title'),
                  description: data.description || existedGroup.get('description')
                });
              });
            } else {
              resolve(false)
            }
          });
      } else {
        resolve(false);
      }
    })
  }

  public removeChapter(payload: {
    groupId: string,
    chapterId: string
  }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if(this.connection) {
        const { groupId, chapterId } = payload;
        this.connection('group_chapter')
            .where({
              group_id: groupId,
              chapter_id: chapterId
            })
            .del()
            .then(() => {
              resolve(true)
            }).catch(error => {
              reject(error);
            });
      } else {
        resolve(false);
      }
    })
  }

  public addChapter(payload: {
    groupId: string,
    chapterId: string
  }): Promise<boolean> {
    if(!this.connection) {
      return Promise.resolve(false);
    }

    const connection = this.connection;
    return new Promise((resolve) => {
      const { chapterId, groupId } = payload;
      Promise.all([
        getChapter(connection, chapterId),
        getGroup(connection, groupId)
      ]).then(([chapter, group]) => {
        if(chapter && group) {
          const GroupChapterModel = modelFactory(this.connection).getModel(ModelName.GroupChapter);
          if(GroupChapterModel) {
            GroupChapterModel.where({
              group_id: groupId,
              chapter_id: chapterId
            })
            .count()
            .then((total: number) => {
              if(total > 0) {
                resolve(true)
              } else {
                connection('group_chapter').insert({ 
                    chapter_id: chapterId,
                    group_id: groupId,
                    order: -1
                  }, 
                  ['id', 'chapter_id', 'group_id', 'order']
                ).then((result: IGroupChapterRead[]) => {
                  if(result.length > 0) {
                    resolve(true)
                  } else {
                    resolve(false)
                  }
                })
              }
            })
          }
        } else {
          resolve(false);
        }
      })
    })
  }

  public fetch(): Promise<IGroupRead[]> {
    return new Promise((resolve, reject) => {
      const GroupModel = modelFactory(this.connection).getModel(ModelName.Group);
      if(GroupModel) {
        GroupModel.fetchAll({ withRelated: ['chapterIds'] }).then(res => {
          const result: IGroupRead[] = [];
          if(res.models.length > 0) {
            res.models.forEach(item => {
              const chapterIds: string[] = [];
              item.related('chapterIds').models.forEach((chapter: any) => {
                chapterIds.push(chapter.get('chapter_id'))
              })
              result.push({
                id: item.get('id'),
                title: item.get('title'),
                description: item.get('description'),
                parent_id: item.get('parent_id') || null,
                chapterIds
              });
            });
          }
          resolve(result)
        }).catch(error => {
          reject(error);
        })
      } else {
        resolve([]);
      }
    })
  }
}