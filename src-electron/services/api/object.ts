import { IObjectRead, IObjectCreate, IOBjectUpdate } from 'src/models/Object';
import { IObjectExtraRead } from 'src/models/ObjectExtra';
import { modelFactory, ModelName } from '../models';
import { BaseApi } from './base';

export class ObjectApi extends BaseApi {
  public fetch(): Promise<IObjectRead[]> {
    return new Promise((resolve, reject) => {
      const ObjectModel = modelFactory(this.connection).getModel(ModelName.Object);
      if(ObjectModel) {
        ObjectModel.fetchAll({ withRelated: ['metas'] }).then(res => {
          const result: IObjectRead[] = [];
          if(res.models.length > 0) {
            res.models.forEach(item => {
              const metas: IObjectExtraRead[] = [];
              item.related('metas').models.forEach((meta: any) => {
                metas.push({
                  id: meta.get('id'),
                  key: meta.get('key'),
                  value: meta.get('value'),
                  object_id: meta.get('object_id'),
                })
              })
              result.push({
                id: item.get('id'),
                name: item.get('name'),
                type: item.get('type'),
                alias: item.get('alias'),
                description: item.get('description'),
                hint: item.get('hint'),
                metas
              });
            });
          }
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      } else {
        resolve([]);
      }
    });
  }

  protected aliasExisted(alias: string, id = ''): Promise<boolean> {
    return new Promise((resolve) => {
      const ObjectModel = modelFactory(this.connection).getModel(ModelName.Object);
      if(ObjectModel) {
        ObjectModel.query((qb) => {
          qb.where('alias', alias);
          if(id !== '') {
            qb.where('id', '<>', id)
          }
        }).count()
          .then((count: number) => {
            resolve(count > 0)
          });
      } else {
        resolve(false)
      }
    });
  }

  public create(payload: {
    data: IObjectCreate
  }): Promise<IObjectRead | boolean> {
    return new Promise((resolve, reject) => {
      const ObjectModel = modelFactory(this.connection).getModel(ModelName.Object);
      if(ObjectModel) {
        const { data } = payload;
        this.aliasExisted(data.alias).then((existed: boolean) => {
          if(!existed) {
            if(this.connection) {
              this.connection('object').insert(data, ['id', 'name', 'alias', 'description', 'hint', 'type'])
                .then((result: IObjectRead[])  => {
                  if(result.length > 0) {
                    resolve(result[0])
                  }else {
                    resolve(false)
                  }
                }).catch(e => {
                  reject(e)
                })
            } else {
              resolve(false);
            }
          }
        })
      } else {
        resolve(false);
      }
    })
  }

  public update(payload: {
    data: IOBjectUpdate,
    id: string
  }): Promise<IObjectRead | false> {
    return new Promise((resolve) => {
      const ObjectModel = modelFactory(this.connection).getModel(ModelName.Object);
      if(ObjectModel) {
        const { data, id } = payload;
        ObjectModel
          .where({
            id
          })
          .fetch({ require: false })
          .then((existedCharacter: any) => {
            if(existedCharacter) {
              existedCharacter.save(data).then(() => {
                resolve({
                  id,
                  name: data.name || existedCharacter.get('name'),
                  alias: data.alias || existedCharacter.get('alias'),
                  type: data.alias || existedCharacter.get('type'),
                  description: data.description || existedCharacter.get('description'),
                  hint: data.hint || existedCharacter.get('hint'),
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
}