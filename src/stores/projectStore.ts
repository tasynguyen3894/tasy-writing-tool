import { defineStore } from 'pinia';
import { ref } from 'vue';

import { useCharacterStore } from './characterStore';
import { useChapterStore } from './chapterStore';
import { useObjectrStore } from './objectStore';
import { set, remove } from 'src/util/storage';
import { PROJECT_PATH_KEY } from 'src/util/constant';

export const useProjectStore = defineStore('project', () => {
  const project = ref<string>('');
  const author = ref<string>('');
  const projectPath = ref<string | null>(null);

  function init(newProjectPath: string, newProject: string, newAuthor: string) {
    set(PROJECT_PATH_KEY, newProjectPath);
    projectPath.value = newProjectPath;
    author.value = newAuthor;
    project.value = newProject;
    useCharacterStore().init();
    useChapterStore().init();
    useObjectrStore().init();
  }

  function reset() {
    remove(PROJECT_PATH_KEY);
    projectPath.value = null;
    author.value = '';
    project.value = '';
  }

  return {
    project,
    author,
    projectPath,
    init,
    reset
  }
});

