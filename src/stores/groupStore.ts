import { ref } from 'vue';
import { defineStore } from 'pinia';

import { IGroupRead } from 'src/models/Group';
import { Routes } from 'src/models/Api';
import { useProjectStore } from './projectStore';

export const useGroupStore = defineStore('group', () => {
  const groups = ref<IGroupRead[]>([]);
  const projectStore = useProjectStore();

  function init(): Promise<void> {
    return new Promise((resolve, reject) => {
      if(projectStore.projectPath) {
        window.Native.api({  method: Routes.FetchGroups, payload: {}, path: projectStore.projectPath })
          .then((result: IGroupRead[]) => {
            groups.value = result;
            resolve();
          });
      } else {
        return Promise.resolve();
      }
    });
  }

  return {
    groups,
    init
  }
})
