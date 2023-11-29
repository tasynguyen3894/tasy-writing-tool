import { ref } from 'vue';
import { defineStore } from 'pinia';

import { IChapterReadItem, IChapter, IChapterCreate, IChapterUpdate } from 'src/models/Chapter';
import { Routes } from 'src/models/Api';
import { useProjectStore } from './projectStore';
import { useService } from 'src/services/useService';
import { findItem } from 'src/util/helper';

export const useChapterStore = defineStore('chapter', () => {
  const chapters = ref<IChapterReadItem[]>([]);
  const projectStore = useProjectStore();
  const chapterService = useService().getChapterService();

  function init(): Promise<void> {
    return new Promise((resolve, reject) => {
      if(projectStore.projectPath) {
        chapterService.getChapters(projectStore.projectPath)
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
    return findItem<IChapterReadItem>(chapters.value, id);
  }

  function remove(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      if(projectStore.projectPath) {
        chapterService.removeChapter(projectStore.projectPath, id)
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

  function create(data: IChapterCreate): Promise<void> {
    return new Promise((resolve, reject) => {
      if(projectStore.projectPath) {
        chapterService.createChapter(projectStore.projectPath, data)
          .then((result: IChapterReadItem) => {
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

  function update(id: string, data: IChapterUpdate): Promise<void> {
    return new Promise((resolve, reject) => {
      if(projectStore.projectPath) {
        chapterService.updateChapter(projectStore.projectPath, id, JSON.parse(JSON.stringify(data)))
         .then((result: IChapterReadItem) => {
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
});
