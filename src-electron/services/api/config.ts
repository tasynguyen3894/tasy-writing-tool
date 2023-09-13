import { Knex } from 'knex';

import { modelFactory, ModelName } from '../models';
import { IConfigRead } from '../models/Config';

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
