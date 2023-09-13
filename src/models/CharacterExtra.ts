export const CharacterExtra = {
  tableName: 'character_extra'
}

export interface ICharacterExtra {
  character_id: string,
  key: string,
  value: string
}

export interface ICharacterExtraRead extends ICharacterExtra {
  id: string
}

export interface ICharacterExtraCreate extends ICharacterExtra {
}

export interface ICharacterExtraModify {
  id?: string,
  key: string,
  value: string
}
