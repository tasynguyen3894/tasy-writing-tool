import { ICharacterExtraRead } from "./CharacterExtra"

export const Migration = {
  tableName: 'knex_migrations'
}

export interface ICharacter {
  name: string,
  alias: string,
  description?: string,
  hint?: string,
  metas?: ICharacterExtraRead[]
}

export type ICharacterCreate = Omit<ICharacter, 'metas'>;

export type ICharacterUpdate = Partial<ICharacterCreate>;

export interface ICharacterRead extends ICharacter {
  id: string
}


