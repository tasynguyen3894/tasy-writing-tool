import { Knex } from 'knex';

import { IObjectRead } from 'src/models/Object';
import { ModelName, modelFactory } from 'src-electron/services/models';
import { IObjectExtraRead } from 'src/models/ObjectExtra';

export function fetchObject(connection: Knex): Promise<IObjectRead[]> {
  return new Promise((resolve, reject) => {
    const ObjectModel = modelFactory(connection).getModel(ModelName.Object);
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
