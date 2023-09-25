import { Knex } from 'knex';

import { ICharacterRead } from 'src/models/Character';
import { ModelName, modelFactory } from 'src-electron/services/models';
import { ICharacterExtraRead } from 'src/models/CharacterExtra';

export function fetchCharacter(connection: Knex): Promise<ICharacterRead[]> {
  return new Promise((resolve, reject) => {
    const CharacterModel = modelFactory(connection).getModel(ModelName.Character);
    if(CharacterModel) {
      CharacterModel.fetchAll({ withRelated: ['metas'] }).then(res => {
        const result: ICharacterRead[] = [];
        if(res.models.length > 0) {
          res.models.forEach(item => {
            const metas: ICharacterExtraRead[] = [];
            item.related('metas').models.forEach((meta: any) => {
              metas.push({
                id: meta.get('id'),
                key: meta.get('key'),
                value: meta.get('value'),
                character_id: meta.get('character_id'),
              })
            })
            result.push({
              id: item.get('id'),
              name: item.get('name'),
              alias: item.get('alias'),
              description: item.get('description'),
              hint: item.get('hint'),
              metas
            });
          });
        }
        resolve(result)
      })
    } else {
      resolve([]);
    }
  });
}