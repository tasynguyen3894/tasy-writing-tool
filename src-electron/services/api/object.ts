import { IObjectRead, IObjectCreate, IOBjectUpdate } from 'src/models/Object';
import { IObjectExtraRead, IObjectExtraCreate } from 'src/models/ObjectExtra';
import { modelFactory, ModelName } from '../models';
import { BaseApi } from './base';
import { fetchObject } from './db/object';

export class ObjectApi extends BaseApi {
  public fetch(): Promise<IObjectRead[]> {
    if(!this.connection) {
      return Promise.resolve([]);
    }
    return fetchObject(this.connection);
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

  public remove(data: { id: string }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if(this.connection) {
        const connection = this.connection;
        connection('object_extra')
          .where('object_id', data.id)
          .del()
          .then(() => {
            connection('object')
            .where('id', data.id)
            .del()
            .then(() => {
              resolve(true)
            }).catch(error => {
              reject(error);
            });
          }).catch(error => {
            reject(error);
          });
      } else {
        resolve(false);
      }
    })
  }

  public createExtra(payload: {
    data: IObjectExtraCreate
  }): Promise<IObjectExtraRead | boolean> {
    return new Promise((resolve) => {
      const ObjectModel = modelFactory(this.connection).getModel(ModelName.Object);
      const ObjectExtraModel = modelFactory(this.connection).getModel(ModelName.ObjectExtra);
      if(ObjectModel && ObjectExtraModel) {
        const { data } = payload;
        ObjectModel
          .where('id', data.object_id)
          .count()
          .then((count: number) => {
            if(count > 0) {
              ObjectExtraModel
                .where({
                  object_id: data.object_id,
                  key: data.key
                }).fetch({ require: false }).then((existedExtra: any) => {
                  if(existedExtra) {
                    existedExtra.save({
                      value: data.value
                    }).then(() => {
                      resolve({
                        id: existedExtra.get('id'),
                        key: data.key,
                        value: data.value,
                        object_id: data.object_id
                      })
                    });
                  } else {
                    if(this.connection) {
                      this.connection('object_extra')
                      .insert(data, ['id', 'object_id', 'key', 'value'])
                        .then((result: IObjectExtraRead[])  => {
                          if(result.length > 0) {
                            resolve(result[0])
                          }else {
                            resolve(false)
                          }
                        }).catch(e => {
                          console.log(e)
                        })
                    }
                  }
                })
            } else {
              resolve(false);
            }
          });
      } else {
        resolve(false);
      }
    })
  }

  public removeExtra(payload: { id: string }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if(this.connection) {
        this.connection('object_extra')
          .where('id', payload.id)
          .del()
          .then(() => {
            resolve(true);
          }).catch(error => {
            reject(error);
          });
      } else {
        resolve(false);
      }
    })
  }
}