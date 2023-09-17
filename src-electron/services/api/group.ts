import { IGroupRead } from 'src/models/Group';
import { modelFactory, ModelName } from '../models';
import { BaseApi } from './base';

export class GroupApi extends BaseApi {
  // public create(payload: {
  //   data: IChapterCreate
  // }): Promise<IChapterReadItem | boolean> {
  //   return new Promise((resolve) => {
  //     if(this.connection) {
  //       const { data } = payload;
  //       this.connection('group').insert(data, ['id', 'title', 'description', 'parent_id'])
  //         .then((result: IChapterAfterCreated[])  => {
  //           if(result.length > 0) {
  //             resolve({
  //               ...result[0],
  //               tags: result[0].tags ? result[0].tags.split(',') : []
  //             })
  //           } else {
  //             resolve(false)
  //           }
  //         }).catch(e => {
  //           console.log(e)
  //         })
  //     } else {
  //       resolve(false);
  //     }
  //   })
  // }

  // public remove(data: { id: string }): Promise<boolean> {
  //   return new Promise((resolve, reject) => {
  //     if(this.connection) {
  //       const connection = this.connection;
  //       connection('chapter')
  //           .where('id', data.id)
  //           .del()
  //           .then(() => {
  //             resolve(true)
  //           }).catch(error => {
  //             reject(error);
  //           });
  //     } else {
  //       resolve(false);
  //     }
  //   })
  // }

  // public update(payload: {
  //   data: IChapterUpdate,
  //   id: string
  // }): Promise<IChapterReadItem | false> {
  //   return new Promise((resolve) => {
  //     const ChapterModel = modelFactory(this.connection).getModel(ModelName.Chapter);
  //     if(ChapterModel) {
  //       const { data, id } = payload;
  //       ChapterModel
  //         .where({
  //           id
  //         })
  //         .fetch({ require: false })
  //         .then((existedCharacter: any) => {
  //           if(existedCharacter) {
  //             existedCharacter.save(data).then(() => {
  //               resolve({
  //                 id,
  //                 title: data.title || existedCharacter.get('title'),
  //                 status: data.status || existedCharacter.get('status'),
  //                 description: data.description || existedCharacter.get('description'),
  //                 content: data.content || existedCharacter.get('content'),
  //                 tags: (data.tags || existedCharacter.get('tags')).split(','),
  //               });
  //             });
  //           } else {
  //             resolve(false)
  //           }
  //         });
  //     } else {
  //       resolve(false);
  //     }
  //   })
  // }

  public fetch(): Promise<IGroupRead[]> {
    return new Promise((resolve, reject) => {
      const GroupModel = modelFactory(this.connection).getModel(ModelName.Group);
      if(GroupModel) {
        GroupModel.fetchAll().then(res => {
          const result: IGroupRead[] = [];
          if(res.models.length > 0) {
            res.models.forEach(item => {
              result.push({
                id: item.get('id'),
                title: item.get('title'),
                description: item.get('description'),
                parent_id: item.get('parent_id') || null
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