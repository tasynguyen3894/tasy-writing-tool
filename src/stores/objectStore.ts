import { ref } from 'vue';
import { defineStore } from 'pinia';

import { IOBjectUpdate, IObjectCreate, IObjectRead } from 'src/models/Object';
import { Routes } from 'src/models/Api';
import { useProjectStore } from './projectStore';

export const useObjectrStore = defineStore('object', () => {
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

  return {
    objects,
    init,
    createObject,
    updateObject,
    aliasIsExisted
  }
})
