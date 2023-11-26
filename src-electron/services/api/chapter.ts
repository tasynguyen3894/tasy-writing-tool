import fs from 'fs';
import path from 'path';

import { IChapterReadItem, IChapterCreate, IChapterAfterCreated, IChapterUpdate } from 'src/models/Chapter';
import { modelFactory, ModelName } from '../models';
import { BaseApi } from './base';
import { fetchCharacter } from './db/character';
import { fetchObject } from './db/object';
import { findVariableValue } from 'src/util/editor';
import { exportChapter, prepareForExport } from './db/chapter';
import { getConfig } from './db/config';
import { ConfigKey } from 'src/models/Config';

export class ChapterApi extends BaseApi {
  public create(payload: {
    data: IChapterCreate
  }): Promise<IChapterReadItem | boolean> {
    return new Promise((resolve, reject) => {
      if(this.connection) {
        const { data } = payload;
        this.connection('chapter').insert(data, ['id', 'title', 'status', 'description', 'tags', 'content'])
          .then((result: IChapterAfterCreated[])  => {
            if(result.length > 0) {
              resolve({
                ...result[0],
                tags: result[0].tags ? result[0].tags.split(',') : []
              })
            } else {
              resolve(false)
            }
          }).catch(e => {
            reject(e)
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
        connection('chapter')
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
    data: IChapterUpdate,
    id: string
  }): Promise<IChapterReadItem | false> {
    return new Promise((resolve) => {
      const ChapterModel = modelFactory(this.connection).getModel(ModelName.Chapter);
      if(ChapterModel) {
        const { data, id } = payload;
        ChapterModel
          .where({
            id
          })
          .fetch({ require: false })
          .then((existedCharacter: any) => {
            if(existedCharacter) {
              const updatedData: any = data;
              if(data.tags) {
                updatedData.tags = data.tags.join(',');
              }
              existedCharacter.save(updatedData).then(() => {
                resolve({
                  id,
                  title: data.title || existedCharacter.get('title'),
                  status: data.status || existedCharacter.get('status'),
                  description: data.description || existedCharacter.get('description'),
                  content: data.content || existedCharacter.get('content'),
                  tags: (data.tags || existedCharacter.get('tags')).split(','),
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

  public fetch(): Promise<IChapterReadItem[]> {
    return new Promise((resolve, reject) => {
      const ChapterModel = modelFactory(this.connection).getModel(ModelName.Chapter);
      if(ChapterModel) {
        ChapterModel.fetchAll().then(res => {
          const result: IChapterReadItem[] = [];
          if(res.models.length > 0) {
            res.models.forEach(item => {
              result.push({
                id: item.get('id'),
                title: item.get('title'),
                description: item.get('description'),
                content: item.get('content'),
                tags: item.get('tags').split(','),
                status: item.get('status')
              });
            });
          }
          resolve(result)
        })
      } else {
        resolve([]);
      }
    });
  }

  public export(payload: { id: string, pathExport: string }): Promise<boolean> {
    if(!this.connection) {
      return Promise.resolve(false);
    }
    const connection = this.connection;
    const ChapterModel = modelFactory(this.connection).getModel(ModelName.Chapter);

    if(!ChapterModel) {
      return Promise.resolve(false);
    }
    
    return new Promise((resolve, reject) => {
      const { id, pathExport } = payload;
      prepareForExport(connection).then(({
        characters,
        objects,
        config
      }) => {
        exportChapter(connection, {
          pathExport,
          id,
          characters,
          objects,
          config
        }).then(() => {
          resolve(true)
        })
        .catch(error => {
          reject(error);
        })
      }).catch(error => reject(error));
    });
  }
}