import { Routes } from 'src/models/Api';

import { IChapterReadItem, IChapterCreate, IChapterUpdate } from 'src/models/Chapter';
import { ICharacterCreate, ICharacterRead, ICharacterUpdate } from 'src/models/Character';
import { ICharacterExtraCreate, ICharacterExtraRead } from 'src/models/CharacterExtra';
import { IGroupCreate, IGroupRead, IGroupUpdate } from './models/Group';
import { IOBjectUpdate, IObjectCreate, IObjectRead } from 'src/models/Object';
import { IObjectExtraCreate } from './models/ObjectExtra';
import { IConfigCreate, IConfigRead } from 'src/models/Config';

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

type ExportChapterApi = ApiCalling<{
  method: Routes.ExportChapter,
  payload: {
    id: string,
    pathExport: string
  }
}, boolean>;

type ChapterApi = FetchChapterApi | RemoveChapterApi | CreateChapterApi | UpdateChapterApi | ExportChapterApi;

type FetchGroupApi = ApiCalling<{
  method: Routes.FetchGroups,
  payload: {}
}, IGroupRead[]>;

type CreateGroupApi = ApiCalling<{
  method: Routes.CreateGroup,
  payload: {
    data: IGroupCreate
  }
}, IGroupRead[]>;

type RemoveGroupApi = ApiCalling<{
  method: Routes.RemoveGroup,
  payload: {
    id: string
  }
}, boolean>;

type UpdateGroupApi = ApiCalling<{
  method: Routes.UpdateGroup,
  payload: {
    id: string,
    data: IGroupUpdate
  }
}, IGroupRead>;

type GroupAddChapterApi = ApiCalling<{
  method: Routes.GroupAddChapter,
  payload: {
    groupId: string,
    chapterId: string
  }
}, boolean>;

type GroupApi = FetchGroupApi | CreateGroupApi | RemoveGroupApi | UpdateGroupApi | GroupAddChapterApi;

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

type RemoveObjectApi = ApiCalling<{
  method: Routes.RemoveObject,
  payload: {
    id: string
  }
}, boolean>;

type RemoveObjectExtraApi = ApiCalling<{
  method: Routes.RemoveObjectExtra,
  payload: {
    id: string
  }
}, boolean>;

type CreateObjectExtraApi = ApiCalling<{
  method: Routes.CreateObjectExtra,
  payload: {
    data: IObjectExtraCreate
  }
}, ICharacterExtraRead>;

type ObjectApi = FetchObjectApi | CreateObjectApi | UpdateObjectApi | RemoveObjectApi | RemoveObjectExtraApi | CreateObjectExtraApi;

type FetchConfigApi = ApiCalling<{
  method: Routes.FetchConfig,
  payload: {
    id: string
  }
}, IConfigRead[]>;

type RemoveConfigApi = ApiCalling<{
  method: Routes.RemoveConfig,
  payload: {
    id: string
  }
}, boolean>;

type CreateConfigApi = ApiCalling<{
  method: Routes.CreateConfig,
  payload: {
    data: IConfigCreate
  }
}, IConfigRead>;

type ConfigApi = FetchConfigApi | CreateConfigApi | RemoveConfigApi;

type Api = ChapterApi | FetchCharacterApi | RemoveCharacterApi | CreateCharacterApi | UpdateCharacterApi | RemoveCharacterExtraApi | CreateCharacterExtraApi | ObjectApi | GroupApi | ConfigApi;

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
      api: (a: Api) => Promise<any>,
      project: (a: ProjectType) => any,
      export: () => Promise<any>
    },
    Store: any
  }
}
