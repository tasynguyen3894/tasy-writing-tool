import fs from 'fs';
import path from 'path';

import { IGroupRead, IGroupCreate, IGroupUpdate, IGroupReadDB } from 'src/models/Group';
import { modelFactory, ModelName } from '../models';
import { BaseApi } from './base';
import { createFileWord, exportChapterContent, getChapter, prepareForExport } from './db/chapter';
import { getGroup, getGroupChapters } from './db/group';
import { IGroupChapterRead } from 'src/models/GroupChapter';
import { IChapterRead } from 'src/models/Chapter';

export class GroupApi extends BaseApi {
  public create(payload: {
    data: IGroupCreate
  }): Promise<IGroupRead | boolean> {
    return new Promise((resolve, reject) => {
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
            reject(e);
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

  public updateChapterOrder(payload: {
    groupId: string,
    chapterId: string,
    order: number
  }): Promise<boolean> {
    if(!this.connection) {
      return Promise.resolve(false);
    }

    const connection = this.connection;
    return new Promise((resolve) => {
      const GroupChapterModel = modelFactory(connection).getModel(ModelName.GroupChapter);
      if(GroupChapterModel) {
        const { groupId, chapterId, order } = payload;
        GroupChapterModel
          .where({
            group_id: groupId,
            chapter_id: chapterId
          })
          .fetch({ require: false })
          .then((existedGroupChapter: any) => {
            if(existedGroupChapter) {
              existedGroupChapter.save({ order }).then(() => {
                resolve(true);
              });
            } else {
              resolve(false)
            }
          });
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
              const chapters: {
                id: string,
                order: number | null
              }[] = [];
              item.related('chapterIds').models.forEach((chapter: any) => {
                chapters.push({
                  id: chapter.get('chapter_id'),
                  order: chapter.get('order')
                })
              })
              result.push({
                id: item.get('id'),
                title: item.get('title'),
                description: item.get('description'),
                parent_id: item.get('parent_id') || null,
                chapters
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

  public exportGroup(payload: { id: string, pathExport: string }): Promise<boolean> {
    if(!this.connection) {
      return Promise.resolve(false);
    }
    const connection = this.connection;
    return new Promise(((resolve, reject) => {
      const { id, pathExport } = payload;
      prepareForExport(connection)
        .then(({
          characters,
          objects,
          config
        }) => {
          getGroup(connection, id, ['chapterIds', 'chapters']).then(groupWithChapters => {
            if(groupWithChapters) {
              let sortedData: { chapter: IChapterRead, order: number }[] = [];
              groupWithChapters.chapterIds.forEach(chapterWithOrder => {
                const chapter = groupWithChapters.chapters.find(item => item.id === chapterWithOrder.id);
                if(chapter) {
                  sortedData.push({
                    chapter,
                    order: chapterWithOrder.order
                  });
                }
              });
              sortedData = sortedData.sort((a, b) => {
                return a.order > b.order ? 1 : -1;
              });
              Promise.all(
                sortedData.map(chapter => {
                  return exportChapterContent({
                    characters,
                    objects,
                    chapter: chapter.chapter,
                    config
                  })
                })
              ).then(contents => {
                const contentExport = contents.map((content, index) => {
                  return '<h2>' + sortedData[index].chapter.title + '</h2>' + content
                });
                createFileWord({
                  content: '<h1>' + groupWithChapters.title + '</h1>' + contentExport.join(''),
                  title: groupWithChapters.title,
                  tags: [],
                  description: groupWithChapters.description,
                  author: config.author || ''
                }).then((fileBuffer: any) => {
                  fs.writeFile(path.resolve(pathExport), fileBuffer, (error) => {
                    if (error) {
                      reject(error);
                    } else {
                      resolve(true);
                    }
                  });
                });
              })
            }
          });
        }).catch(error => reject(error));
    }));
  }
}