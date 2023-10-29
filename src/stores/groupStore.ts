import { ref } from 'vue';
import { defineStore } from 'pinia';

import { IGroupCreate, IGroupRead, IGroupUpdate } from 'src/models/Group';
import { useProjectStore } from './projectStore';
import { useService } from 'src/services/useService';
import { findItem } from 'src/util/helper';

export const useGroupStore = defineStore('group', () => {
  const groups = ref<IGroupRead[]>([]);
  const projectStore = useProjectStore();
  const groupService = useService().getGroupService();

  function init(): Promise<void> {
    return new Promise((resolve, reject) => {
      if(projectStore.projectPath) {
        groupService.getGroups(projectStore.projectPath)
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
        groupService.createGroup(projectStore.projectPath, data)
          .then((result: IGroupRead) => {
            groups.value.push(result);
            resolve();
          });
      } else {
        return Promise.resolve();
      }
    });
  }

  function findGroup(id: string): IGroupRead | undefined {
    return findItem<IGroupRead>(groups.value, id);
  }

  function remove(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      if(projectStore.projectPath) {
        groupService.removeGroup(projectStore.projectPath, id)
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

  function addChapter(groupId: string, chapterId: string): Promise<boolean> {
    return new Promise((resolve) => {
      if(projectStore.projectPath) {
        groupService.addChapter(projectStore.projectPath, groupId, chapterId)
          .then((result: boolean) => {
            if(result) {
              groups.value = groups.value.map(group => {
                if(group.id !== groupId) {
                  return group;
                }

                return {
                  ...group,
                  chapters: [...group.chapters, {
                    id: chapterId,
                    order: null
                  }]
                }
              })
              resolve(true);
            } else {
              resolve(false);
            }
          });
      } else {
        return Promise.resolve();
      }
    });
  }

  function removeChapter(groupId: string, chapterId: string): Promise<boolean> {
    return new Promise((resolve) => {
      if(projectStore.projectPath) {
        groupService.removeChapter(projectStore.projectPath, groupId, chapterId)
          .then((result: boolean) => {
            if(result) {
              groups.value = groups.value.map(group => {
                if(group.id !== groupId) {
                  return group;
                }

                return {
                  ...group,
                  chapters: group.chapters.filter(({ id }) => id !== chapterId)
                }
              })
              resolve(true);
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
        groupService.updateGroup(projectStore.projectPath, id, data)
          .then((result: IGroupRead) => {
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

  function updateChapterOrder(groupId: string, chapterId: string, order: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if(projectStore.projectPath) {
        groupService.orderChapter(projectStore.projectPath, groupId, chapterId, order)
          .then((result: boolean) => {
            groups.value = groups.value.map(group => {
              if(group.id === groupId) {
                return {
                  ...group,
                  chapters: group.chapters.map(chapter => {
                    if(chapter.id !== chapterId) {
                      return chapter;
                    }
                    return {
                      ...chapter,
                      order
                    }
                  })
                }
              }
              return group;
            })
            resolve(result);
          }).catch(error => reject(error))
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
    update,
    addChapter,
    removeChapter,
    updateChapterOrder
  }
})
