import { IGroupRead, IGroupCreate, IGroupUpdate } from 'src/models/Group';
import { modelFactory, ModelName } from '../models';
import { BaseApi } from './base';

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
  }): Promise<IGroupRead | false> {
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