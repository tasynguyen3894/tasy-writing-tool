import { ref } from 'vue';
import { defineStore } from 'pinia';

import { IOBjectUpdate, IObjectCreate, IObjectRead } from 'src/models/Object';
import { Routes } from 'src/models/Api';
import { useProjectStore } from './projectStore';
import { IObjectExtraCreate, IObjectExtraRead } from 'src/models/ObjectExtra';

export const useObjectStore = defineStore('object', () => {
  const objects = ref<IObjectRead[]>([]);
  const projectStore = useProjectStore();

  function init(): Promise<void> {
    return new Promise((resolve, reject) => {
      if(projectStore.projectPath) {
        window.Native.api({  method: Routes.FetchObjects, payload: {}, path: projectStore.projectPath})
          .then((result: IObjectRead[]) => {
            objects.value = result;
            resolve();
          })
      } else {
        return Promise.resolve();
      }
    });
  }

  function findObject(id: string): IObjectRead | undefined {
    return objects.value.find(object => object.id === id);
  }

  function createObject(data: IObjectCreate): Promise<boolean> {
    return new Promise((resolve) => {
      if(projectStore.projectPath) {
        window.Native.api({  method: Routes.CreateObject, payload: { data }, path: projectStore.projectPath})
          .then((result: IObjectRead) => {
            objects.value.push(result);
            resolve(true);
          })
      } else {
        return Promise.resolve();
      }
    });
  }

  function updateObject(id: string, data: IOBjectUpdate): Promise<boolean> {
    return new Promise((resolve) => {
      if(projectStore.projectPath) {
        window.Native.api({  method: Routes.UpdateObject, payload: { id, data }, path: projectStore.projectPath})
          .then((result: IObjectRead) => {
            objects.value = objects.value.map(object => {
              if(object.id !== id) {
                return object;
              }
              return {
                ...result,
                metas: object.metas
              }
            })
            resolve(true);
          })
      } else {
        return Promise.resolve();
      }
    });
  }

  function aliasIsExisted(alias: string, id = ''): boolean {
    return objects.value.some(object => {
      return object.alias === alias && (!id || object.id !== id)
    });
  }

  function removeObject(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      if(projectStore.projectPath) {
        window.Native.api({  method: Routes.RemoveObject, payload: { id }, path: projectStore.projectPath})
          .then((result: boolean) => {
            if(result) {
              objects.value = objects.value.filter(object => object.id !== id);
              resolve(result);
            } else {
              resolve(false);
            }
          });
      } else {
        return Promise.resolve();
      }
    });
  }

  function updateExtra(data: IObjectExtraRead) {
    objects.value = objects.value.map(object => {
      if(object.id !== data.object_id) {
        return object;
      }
      const newObject = object;
      if(!newObject.metas) {
        newObject.metas = [data];
      } else {
        let existedExtra = false;
        newObject.metas = newObject.metas.map(meta => {
          if(meta.id !== data.id) {
            return meta
          }
          existedExtra = true;
          return data;
        });
        if(!existedExtra) {
          newObject.metas.push(data);
        }
      }
      return newObject;
    })
  }

  function removeExtra(characterId: string, id: string): Promise<boolean> {
    return new Promise((resolve) => {
      if(projectStore.projectPath) {
        window.Native.api({  method: Routes.RemoveObjectExtra, payload: { id }, path: projectStore.projectPath})
          .then((result: boolean) => {
            objects.value = objects.value.map(object => {
              if(object.id !== characterId || !object.metas) {
                return object;
              }
              return {
                ...object,
                metas: object.metas.filter(meta => meta.id !== id)
              }
            });
            resolve(result);
          });
      } else {
        return Promise.resolve();
      }
    });
  }

  function createExtra(data: IObjectExtraCreate): Promise<void> {
    return new Promise((resolve) => {
      if(projectStore.projectPath) {
        window.Native.api({  method: Routes.CreateObjectExtra, payload: { data }, path: projectStore.projectPath})
          .then((result: IObjectExtraRead | boolean) => {
            if(result instanceof Boolean) {
              resolve();
            } else {
              updateExtra(result as IObjectExtraRead);
              resolve();
            }
          })
      } else {
        return Promise.resolve();
      }
    });
  }

  return {
    objects,
    init,
    createObject,
    updateObject,
    aliasIsExisted,
    findObject,
    removeObject,
    removeExtra,
    createExtra
  }
})
