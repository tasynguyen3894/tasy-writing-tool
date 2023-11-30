import { ICharacterRead, ICharacterCreate, ICharacterUpdate } from 'src/models/Character';
import { ICharacterExtraRead, ICharacterExtraCreate } from 'src/models/CharacterExtra';
import { IObjectRead, IObjectCreate, IOBjectUpdate } from 'src/models/Object';
import { IObjectExtraRead, IObjectExtraCreate } from 'src/models/ObjectExtra';
import { IGroupCreate, IGroupRead, IGroupUpdate } from 'src/models/Group';
import { IChapterCreate, IChapterRead, IChapterUpdate } from 'src/models/Chapter';
import { IConfigCreate, IConfigRead } from 'src/models/Config';

export type Custom<T extends any[], K> = (projectId: string, ...args: T) => Promise<K>
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

export type IGetGroupService = () => {
  getGroups: Fetch<IGroupRead>;
  removeGroup: Remove;
  createGroup: Create<IGroupCreate, IGroupRead>;
  updateGroup: Update<IGroupUpdate, IGroupRead>;
  addChapter: Custom<[groupId: string, chapter: string], boolean>;
  removeChapter: Custom<[groupId: string, chapter: string], boolean>;
  orderChapter: Custom<[groupId: string, chapter: string, order: number], boolean>;
  exportGroup: Custom<[id: string, pathExport: string], boolean>
}

export type IGetChapterService = () => {
  getChapters: Fetch<IChapterRead>;
  removeChapter: Remove;
  createChapter: Create<IChapterCreate, IChapterRead>;
  updateChapter: Update<IChapterUpdate, IChapterRead>;
}

export type IGetConfigService = () => {
  updateConfig: Create<IConfigCreate, IConfigRead>
}

export type IService = {
  getCharacterService: IGetCharacterService,
  getObjectService: IGetObjectService
  getGroupService: IGetGroupService,
  getChapterService: IGetChapterService,
  getConfigService: IGetConfigService
}

