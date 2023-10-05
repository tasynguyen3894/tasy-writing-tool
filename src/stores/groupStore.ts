import { ref } from 'vue';
import { defineStore } from 'pinia';

import { IGroupCreate, IGroupRead, IGroupUpdate } from 'src/models/Group';
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

  function create(data: IGroupCreate): Promise<void> {
    return new Promise((resolve, reject) => {
      if(projectStore.projectPath) {
        window.Native.api({
          method: Routes.CreateGroup,
          payload: {
            data
          },
          path: projectStore.projectPath
        }).then((result: IGroupRead) => {
            groups.value.push(result);
            resolve();
          })
      } else {
        return Promise.resolve();
      }
    });
  }

  function findGroup(id: string): IGroupRead | undefined {
    return groups.value.find(group => group.id === id);
  }

  function remove(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      if(projectStore.projectPath) {
        window.Native.api({  method: Routes.RemoveGroup, payload: { id }, path: projectStore.projectPath})
          .then((result: boolean) => {
            if(result) {
              groups.value = groups.value.filter(group => group.id !== id);
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

  function update(id: string, data: IGroupUpdate): Promise<void> {
    return new Promise((resolve, reject) => {
      if(projectStore.projectPath) {
        window.Native.api({
          method: Routes.UpdateGroup,
          payload: {
            id,
            data: {
              ...data
            },
          },
          path: projectStore.projectPath
        }).then((result: IGroupRead) => {
            groups.value = groups.value.map(group => {
              if(group.id === result.id) {
                return result;
              }
              return group;
            })
            resolve();
          })
      } else {
        return Promise.resolve();
      }
    });
  }

  return {
    groups,
    init,
    create,
    findGroup,
    remove,
    update
  }
})
