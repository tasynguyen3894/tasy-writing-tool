import { ICharacterExtra, ICharacterExtraRead } from 'src/models/CharacterExtra';
import { ICharacterCreate, ICharacterRead, ICharacterUpdate } from 'src/models/Character';
import { modelFactory, ModelName } from '../models';
import { BaseApi } from './base';
import { fetchCharacter } from './db/character';

export class CharacterApi extends BaseApi {
  public create(payload: {
    data: ICharacterCreate
  }): Promise<ICharacterRead | boolean> {
    return new Promise((resolve) => {
      const CharacterModel = modelFactory(this.connection).getModel(ModelName.Character);
      if(CharacterModel) {
        const { data } = payload;
        this.aliasExisted(data.alias).then((existed: boolean) => {
          if(!existed) {
            if(this.connection) {
              this.connection('character').insert(data, ['id', 'name', 'alias', 'description', 'hint'])
                .then((result: ICharacterRead[])  => {
                  if(result.length > 0) {
                    resolve(result[0])
                  }else {
                    resolve(false)
                  }
                }).catch(e => {
                  console.log(e)
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

  protected aliasExisted(alias: string, id = ''): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const CharacterModel = modelFactory(this.connection).getModel(ModelName.Character);
      if(CharacterModel) {
        
        CharacterModel.query((qb) => {
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

  public remove(data: { id: string }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if(this.connection) {
        const connection = this.connection;
        connection('character_extra')
          .where('character_id', data.id)
          .del()
          .then(() => {
            connection('character')
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

  public update(payload: {
    data: ICharacterUpdate,
    id: string
  }): Promise<ICharacterRead | false> {
    return new Promise((resolve) => {
      const CharacterModel = modelFactory(this.connection).getModel(ModelName.Character);
      if(CharacterModel) {
        const { data, id } = payload;
        CharacterModel
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

  public createExtra(payload: {
    data: ICharacterExtra
  }): Promise<ICharacterExtraRead | boolean> {
    return new Promise((resolve) => {
      const CharacterModel = modelFactory(this.connection).getModel(ModelName.Character);
      const CharacterExtraModel = modelFactory(this.connection).getModel(ModelName.CharacterExtra);
      if(CharacterModel && CharacterExtraModel) {
        const { data } = payload;
        CharacterModel
          .where('id', data.character_id)
          .count()
          .then((count: number) => {
            if(count > 0) {
              CharacterExtraModel
                .where({
                  character_id: data.character_id,
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
                        character_id: data.character_id
                      })
                    });
                  } else {
                    if(this.connection) {
                      this.connection('character_extra')
                      .insert(data, ['id', 'character_id', 'key', 'value'])
                        .then((result: ICharacterExtraRead[])  => {
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
        this.connection('character_extra')
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

  public fetch(): Promise<ICharacterRead[]> {
    if(!this.connection) {
      return Promise.resolve([]);
    }
    return fetchCharacter(this.connection);
  }
}