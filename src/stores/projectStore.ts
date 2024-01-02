import { defineStore } from 'pinia';
import { ref } from 'vue';

import { useCharacterStore } from './characterStore';
import { useChapterStore } from './chapterStore';
import { useObjectStore } from './objectStore';
import { useGroupStore } from './groupStore';
import { set, remove } from 'src/util/storage';
import { PROJECT_PATH_KEY } from 'src/util/constant';
import { ConfigKey, IConfigRead } from 'src/models/Config';
import { Routes } from 'src/models/Api';
import { useService } from 'src/services/useService';

const configTitleByKey = {
  [ConfigKey.author]: 'author',
  [ConfigKey.project]: 'project',
}

export const useProjectStore = defineStore('project', () => {
  const project = ref<string>('');
  const author = ref<string>('');
  const projectPath = ref<string | undefined>(undefined);
  const configService = useService().getConfigService();

  function init(newProjectPath: string, newProject: string, newAuthor: string) {
    set(PROJECT_PATH_KEY, newProjectPath);
    projectPath.value = newProjectPath;
    author.value = newAuthor;
    project.value = newProject;
    useCharacterStore().init();
    useChapterStore().init();
    useObjectStore().init();
    useGroupStore().init();
  }

  function reset() {
    remove(PROJECT_PATH_KEY);
    projectPath.value = undefined;
    author.value = '';
    project.value = '';
  }

  function getDataProject(projectPathToDetect: string): Promise<void> {
    return new Promise((resolve) => {
      window.Native.project({ type: 'getData', payload: { path: projectPathToDetect } })
        .then((res: { key: string, value: string }[]) => {
          const projectInStore = res.find(item => item.key === 'project');
          const authorInStore = res.find(item => item.key === 'author');
          init(
            projectPathToDetect,
            projectInStore ? projectInStore.value : '',
            authorInStore ? authorInStore.value : ''
          );
          resolve();
        });
    })
  }

  function updateConfig(key: ConfigKey, value: string) {
    return new Promise<void>((resolve) => {
      if(projectPath.value) {
        configService.updateConfig(projectPath.value, { key, value })
          .then((res: IConfigRead) => {
            if(key === ConfigKey.author) {
              author.value = res.value;
            }
            if(key === ConfigKey.project) {
              project.value = res.value;
            }
            resolve();
          });
      }
    })
  }

  return {
    project,
    author,
    projectPath,
    init,
    reset,
    getDataProject,
    updateConfig
  }
});

