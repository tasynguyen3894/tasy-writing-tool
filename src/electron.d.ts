import { Routes } from 'src/models/Api';

import { IChapterReadItem, IChapterCreate, IChapterUpdate } from 'src/models/Chapter';
import { ICharacterCreate, ICharacterRead, ICharacterUpdate } from 'src/models/Character';
import { ICharacterExtraCreate, ICharacterExtraRead } from 'src/models/CharacterExtra';
import { IGroupRead } from './models/Group';
import { IOBjectUpdate, IObjectCreate, IObjectRead } from 'src/models/Object';

type ApiMessage = {
  path: string
}

type ApiCalling<T, K> = T & ApiMessage;

type FetchChapterApi = ApiCalling<{
  method: Routes.FetchChapters,
  payload: {}
}, IChapterReadItem[]>;

type RemoveChapterApi = ApiCalling<{
  method: Routes.RemoveChapter,
  payload: {
    id: string
  }
}, boolean>;

type CreateChapterApi = ApiCalling<{
  method: Routes.CreateChapter,
  payload: {
    data: IChapterCreate
  }
}, IChapterReadItem>;

type UpdateChapterApi = ApiCalling<{
  method: Routes.UpdateChapter,
  payload: {
    id: string,
    data: IChapterUpdate
  }
}, IChapterReadItem>;

type ChapterApi = FetchChapterApi | RemoveChapterApi | CreateChapterApi | UpdateChapterApi;

type FetchGroupApi = ApiCalling<{
  method: Routes.FetchGroups,
  payload: {}
}, IGroupRead[]>;


type GroupApi = FetchGroupApi;

type FetchCharacterApi = ApiCalling<{
  method: Routes.FetchCharacters,
  payload: {}
}, ICharacterRead[]>;

type RemoveCharacterApi = ApiCalling<{
  method: Routes.RemoveCharacter,
  payload: {
    id: string
  }
}, boolean>;

type CreateCharacterApi = ApiCalling<{
  method: Routes.CreateCharacter,
  payload: {
    data: ICharacterCreate
  }
}, ICharacterRead>;

type UpdateCharacterApi = ApiCalling<{
  method: Routes.UpdateCharacter,
  payload: {
    id: string,
    data: ICharacterUpdate
  }
}, ICharacterRead>;

type RemoveCharacterExtraApi = ApiCalling<{
  method: Routes.RemoveCharacterExtra,
  payload: {
    id: string
  }
}, boolean>;

type CreateCharacterExtraApi = ApiCalling<{
  method: Routes.CreateCharacterExtra,
  payload: {
    data: ICharacterExtraCreate
  }
}, ICharacterExtraRead>;

type FetchObjectApi = ApiCalling<{
  method: Routes.FetchObjects,
  payload: {}
}, IObjectRead[]>;

type CreateObjectApi = ApiCalling<{
  method: Routes.CreateObject,
  payload: {
    data: IObjectCreate
  }
}, IObjectRead>;

type UpdateObjectApi = ApiCalling<{
  method: Routes.UpdateObject,
  payload: {
    id: string,
    data: IOBjectUpdate
  }
}, IObjectRead>;

type ObjectApi = FetchObjectApi | CreateObjectApi | UpdateObjectApi;

type CharacterApi = FetchCharacterApi | RemoveCharacterApi | CreateCharacterApi | UpdateCharacterApi | RemoveCharacterExtraApi | CreateCharacterExtraApi | ObjectApi | GroupApi;

type ProjectDetect = {
  type: 'detect', payload: { path: string }
}

type ProjectSelect = {
  type: 'select'
}

type ProjectSetup = {
  type: 'setup', payload: { path: string, project: string, author: string }
}

type ProjectGetData = {
  type: 'getData', payload: { path: string }
}

type ProjectType = ProjectDetect | ProjectSelect | ProjectSetup | ProjectGetData;

export {};

declare global {
  interface Window {
    Native: {
      api: (a: ChapterApi | CharacterApi) => Promise<any>,
      project: (a: ProjectType) => any
    },
    Store: any
  }
}
