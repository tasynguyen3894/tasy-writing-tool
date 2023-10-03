import { Routes } from 'src/models/Api';
import { IService, IGetCharacterService, IGetObjectService } from './interfaces';
import { ICharacterCreate, ICharacterUpdate } from 'src/models/Character';
import { ICharacterExtraCreate } from 'src/models/CharacterExtra';
import { IObjectCreate, IOBjectUpdate } from 'src/models/Object';
import { IObjectExtraCreate } from 'src/models/ObjectExtra';

export const getCharacterService: IGetCharacterService = () => {
  return {
    getCharacters(projectId: string) {
      return window.Native.api({  method: Routes.FetchCharacters, payload: {}, path: projectId })
    },
    removeCharacter(projectId: string, id: string) {
      return window.Native.api({  method: Routes.RemoveCharacter, payload: { id }, path: projectId })
    },
    createCharacter(projectId: string, data: ICharacterCreate) {
      return window.Native.api({  method: Routes.CreateCharacter, payload: { data }, path: projectId })
    },
    updateCharacter(projectId: string, id: string, data: ICharacterUpdate) {
      return window.Native.api({  method: Routes.UpdateCharacter, payload: { data, id }, path: projectId })
    },
    removeCharacterExtra(projectId: string, id: string) {
      return window.Native.api({  method: Routes.RemoveCharacterExtra, payload: { id }, path: projectId })
    },
    createCharacterExtra(projectId: string, data: ICharacterExtraCreate) {
      return window.Native.api({  method: Routes.CreateCharacterExtra, payload: { data }, path: projectId })
    },
  }
}

export const getObjectService: IGetObjectService = () => {
  return {
    getObjects(projectId: string) {
      return window.Native.api({  method: Routes.FetchObjects, payload: {}, path: projectId })
    },
    removeObject(projectId: string, id: string) {
      return window.Native.api({  method: Routes.RemoveObject, payload: { id }, path: projectId })
    },
    createObject(projectId: string, data: IObjectCreate) {
      return window.Native.api({  method: Routes.CreateObject, payload: { data }, path: projectId })
    },
    updateObject(projectId: string, id: string, data: IOBjectUpdate) {
      return window.Native.api({  method: Routes.UpdateObject, payload: { data, id }, path: projectId })
    },
    removeObjectExtra(projectId: string, id: string) {
      return window.Native.api({  method: Routes.RemoveObjectExtra, payload: { id }, path: projectId })
    },
    createObjectExtra(projectId: string, data: IObjectExtraCreate) {
      return window.Native.api({  method: Routes.CreateObjectExtra, payload: { data }, path: projectId })
    },
  }
}

export function getElectronService(): IService {
  return {
    getCharacterService,
    getObjectService
  }
}
