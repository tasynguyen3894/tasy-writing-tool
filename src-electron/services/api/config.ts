import { Knex } from 'knex';

import { modelFactory, ModelName } from '../models';
import { IConfigRead, IConfigCreate } from 'src/models/Config';
import { BaseApi } from './base';

export function getAllConfig(connection: Knex): Promise<IConfigRead[]> {
  const ConfigModel = modelFactory(connection).getModel(ModelName.Config);
  if(ConfigModel) {
    return new Promise((resolve, reject) => {
      ConfigModel.fetchAll().then(res => {
        const configs: IConfigRead[] = [];
        res.models.forEach(config => {
          configs.push({
            id: config.get('id'),
            key: config.get('key'),
            title: config.get('title'),
            value: config.get('value'),
          })
        });
        resolve(configs)
      });
    })
  } else {
    return Promise.resolve([]);
  }
}

export class ConfigApi extends BaseApi {
  public create(payload: {
    data: IConfigCreate
  }): Promise<IConfigRead | boolean> {
    return new Promise((resolve) => {
      const ConfigModel = modelFactory(this.connection).getModel(ModelName.Config);
      if(ConfigModel) {
        const { data } = payload;
        ConfigModel
          .where({
            key: data.key
          }).fetch({ require: false }).then((existedConfig: any) => {
            if(existedConfig) {
              existedConfig.save({
                title: '',
                value: data.value
              }).then(() => {
                resolve({
                  id: existedConfig.get('id'),
                  title: '',
                  key: data.key,
                  value: data.value
                })
              });
            } else {
              if(this.connection) {
                this.connection('config')
                .insert(data, ['id', 'title', 'key', 'value'])
                  .then((result: IConfigRead[])  => {
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
    })
  }

  public remove(payload: { id: string }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if(this.connection) {
        this.connection('config')
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

  public fetch(): Promise<IConfigRead[]> {
    return new Promise((resolve, reject) => {
      const ConfigModel = modelFactory(this.connection).getModel(ModelName.Config);
      if(ConfigModel) {
          ConfigModel.fetchAll().then(res => {
            const configs: IConfigRead[] = [];
            res.models.forEach(config => {
              configs.push({
                id: config.get('id'),
                key: config.get('key'),
                title: config.get('title'),
                value: config.get('value'),
              })
            });
            resolve(configs)
          });
      } else {
        return Promise.resolve([]);
      }
    });
  }
}

