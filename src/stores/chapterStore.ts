import { ref } from 'vue';
import { defineStore } from 'pinia';

import { IChapterReadItem, IChapter } from 'src/models/Chapter';
import { Routes } from 'src/models/Api';
import { useProjectStore } from './projectStore';

export const useChapterStore = defineStore('chapter', () => {
  const chapters = ref<IChapterReadItem[]>([]);
  const projectStore = useProjectStore();

  function init(): Promise<void> {
    return new Promise((resolve, reject) => {
      if(projectStore.projectPath) {
        window.Native.api({  method: Routes.FetchChapters, payload: {}, path: projectStore.projectPath })
          .then((result: IChapterReadItem[]) => {
            chapters.value = result;
            resolve();
          })
      } else {
        return Promise.resolve();
      }
    });
  }

  function findChapter(id: string): IChapterReadItem | undefined {
    return chapters.value.find(chapter => chapter.id === id);
  }

  function remove(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      if(projectStore.projectPath) {
        window.Native.api({  method: Routes.RemoveChapter, payload: { id }, path: projectStore.projectPath})
          .then((result: boolean) => {
            if(result) {
              chapters.value = chapters.value.filter(chapter => chapter.id !== id);
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

  function create(data: IChapter): Promise<void> {
    return new Promise((resolve, reject) => {
      if(projectStore.projectPath) {
        window.Native.api({
          method: Routes.CreateChapter,
          payload: {
            data: {
              ...data,
              tags: data.tags ? data.tags.join(',') : ''
            },
          },
          path: projectStore.projectPath
        }).then((result: IChapterReadItem) => {
            chapters.value.push(result);
            resolve();
          })
      } else {
        return Promise.resolve();
      }
    });
  }

  function exportChapter(id: string, url: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if(projectStore.projectPath) {
        window.Native.api({
          method: Routes.ExportChapter,
          payload: {
            id,
            pathExport: url
          },
          path: projectStore.projectPath
        }).then((result: boolean) => {
            resolve(result);
          })
      } else {
        return Promise.resolve();
      }
    });
  }

  function update(id: string, data: IChapter): Promise<void> {
    return new Promise((resolve, reject) => {
      if(projectStore.projectPath) {
        window.Native.api({
          method: Routes.UpdateChapter,
          payload: {
            id,
            data: {
              ...data,
              tags: data.tags ? data.tags.join(',') : ''
            },
          },
          path: projectStore.projectPath
        }).then((result: IChapterReadItem) => {
            chapters.value = chapters.value.map(chapter => {
              if(chapter.id === result.id) {
                return result;
              }
              return chapter;
            })
            resolve();
          })
      } else {
        return Promise.resolve();
      }
    });
  }

  return {
    chapters,
    init,
    create,
    findChapter,
    update,
    remove,
    exportChapter
  }
})
