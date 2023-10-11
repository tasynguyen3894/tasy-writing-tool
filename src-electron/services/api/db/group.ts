import { Knex } from 'knex';

import { modelFactory, ModelName } from 'src-electron/services/models';
import { IGroupRead } from 'src/models/Group';

export function getGroup(connection: Knex, id: string): Promise<IGroupRead | undefined> {
  const GroupModel = modelFactory(connection).getModel(ModelName.Group);

  if(!GroupModel) {
    return Promise.resolve(undefined);
  }
  
  return new Promise((resolve, reject) => {
    GroupModel.where({ id }).fetch({ require: false }).then((group: any) => {
      if(group) {
        resolve({
          id: group.get('id'),
          title: group.get('title'),
          description: group.get('description')
        });
      } else {
        resolve(undefined)
      }
    }).catch((error: Error) => {
      reject(error)
    })
  });
}
