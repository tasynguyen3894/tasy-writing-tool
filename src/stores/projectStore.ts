import { defineStore } from 'pinia';
import { ref } from 'vue';

import { useCharacterStore } from './characterStore';
import { useChapterStore } from './chapterStore';
import { useObjectrStore } from './objectStore';

export const useProjectStore = defineStore('project', () => {
  const project = ref<string>('');
  const author = ref<string>('');
  const projectPath = ref<string | null>(null);

  function init(newProjectPath: string, newProject: string, newAuthor: string) {
    projectPath.value = newProjectPath;
    author.value = newAuthor;
    project.value = newProject;
    useCharacterStore().init();
    useChapterStore().init();
    useObjectrStore().init();
  }

  function reset() {
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

