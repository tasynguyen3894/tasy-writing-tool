import { Knex } from 'knex';

import { modelFactory, ModelName } from 'src-electron/services/models';
import { IConfigRead } from 'src/models/Config';

export function getConfig(connection: Knex, key: string): Promise<IConfigRead | undefined> {
  const ConfigModel = modelFactory(connection).getModel(ModelName.Config);

  if(!ConfigModel) {
    return Promise.resolve(undefined);
  }
  
  return new Promise((resolve, reject) => {
    ConfigModel.where({ key }).fetchAll({ require: false }).then((configs: any) => {
      if(configs.length > 0) {
        const config = configs.models[0];
        resolve({
          id: config.get('id'),
          key: config.get('key'),
          title: config.get('title'),
          value: config.get('value'),
        });
      } else {
        resolve(undefined)
      }
    }).catch((error: Error) => {
      reject(error)
    })
  });
}