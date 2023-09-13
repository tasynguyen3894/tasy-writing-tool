import { IChapterReadItem, IChapterCreate, IChapterAfterCreated, IChapterUpdate } from 'src/models/Chapter';
import { modelFactory, ModelName } from '../models';
import { BaseApi } from './base';

export class ChapterApi extends BaseApi {
  public create(payload: {
    data: IChapterCreate
  }): Promise<IChapterReadItem | boolean> {
    return new Promise((resolve) => {
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
              existedCharacter.save(data).then(() => {
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
    })
  }
}