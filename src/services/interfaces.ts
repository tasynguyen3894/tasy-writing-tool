import { ICharacterRead, ICharacterCreate, ICharacterUpdate } from 'src/models/Character';
import { ICharacterExtraRead, ICharacterExtraCreate } from 'src/models/CharacterExtra';
import { IObjectRead, IObjectCreate, IOBjectUpdate } from 'src/models/Object';
import { IObjectExtraRead, IObjectExtraCreate } from 'src/models/ObjectExtra';

export type Fetch<T> = (projectId: string) => Promise<T[]>;
export type Remove = (projectId: string, id: string) => Promise<boolean>;
export type Create<T, K> = (projectId: string, payload: T) => Promise<K>;
export type Update<T, K> = (projectId: string, id: string, payload: T) => Promise<K>;

export type IGetCharacterService = () => {
  getCharacters: Fetch<ICharacterRead>;
  removeCharacter: Remove;
  createCharacter: Create<ICharacterCreate, ICharacterRead>;
  updateCharacter: Update<ICharacterUpdate, ICharacterRead>;
  createCharacterExtra: Create<ICharacterExtraCreate, ICharacterExtraRead>;
  removeCharacterExtra: Remove
}

export type IGetObjectService = () => {
  getObjects: Fetch<IObjectRead>;
  removeObject: Remove;
  createObject: Create<IObjectCreate, IObjectRead>;
  updateObject: Update<IOBjectUpdate, IObjectRead>;
  createObjectExtra: Create<IObjectExtraCreate, IObjectExtraRead>;
  removeObjectExtra: Remove
}

export type IService = {
  getCharacterService: IGetCharacterService,
  getObjectService: IGetObjectService
}

