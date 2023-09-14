import { ref } from 'vue';
import { defineStore } from 'pinia';

import { IObjectRead } from 'src/models/Object';
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

  return {
    objects,
    init
  }
})
