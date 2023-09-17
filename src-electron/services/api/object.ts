import { Knex } from 'knex';

import { IObjectRead } from 'src/models/Object';
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
}