<template>
  <q-page class="row items-center justify-evenly">
    <div v-if="!projectPath">
      <q-btn label="Open project" @click="openDialog()" />
    </div>
    <div class="setup-project" v-if="!projectIsSetUp && projectPath">
      <div>The project is not set up in this folder. Do you want to setup an project here?</div>
      <div><q-btn label="Close" @click="projectPath = ''" /> <q-btn label="Setup" @click="isShowSetup = true" color="primary" /></div>
    </div>
  </q-page>
  <DialogSetupProject v-model="isShowSetup" @submit="submit"/>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

import DialogSetupProject, { ProjectInfo } from 'src/components/DialogSetupProject.vue';
import { useProjectStore } from  'src/stores/projectStore';
import { RouterNames } from 'src/router/routes';

import { get } from 'src/util/storage';
import { PROJECT_PATH_KEY } from 'src/util/constant';
import { detectProjectPath } from 'src/util/helper';

const $q = useQuasar();
const router = useRouter();

const projectStore = useProjectStore();

const projectIsSetUp = ref<boolean>(false);
const projectPath = ref<string>('');
const isShowSetup = ref<boolean>(false);

onMounted(() => {
  get(PROJECT_PATH_KEY)
    .then((projectPathInStore: any) => {
      if(projectPathInStore) {
        setupProject(projectPathInStore);
      }
    })
})

function setupProject(projectPathToDetect: string) {
  detectProjectPath(projectPathToDetect).then((res: any) => {
    projectIsSetUp.value = res;
    if(res) {
      projectStore.getDataProject(projectPathToDetect).then(() => {
        router.push({ name: RouterNames.ProjectOverviewPage });
      });
    }
  })
}

function openDialog() {
  window.Native.project({ type: 'select' }).then((data: any) => {
    if(data.filePaths && data.filePaths.length > 0) {
      projectPath.value = data.filePaths[0];
      setupProject(projectPath.value);
    }
  })
}

function setup({ project, author }: ProjectInfo) {
  window.Native
    .project({ type: 'setup', payload: { 
        path: projectPath.value, project, author 
      }
    }).then((success: boolean) => {
      if(success) {
        $q.notify('Setup project completed');
        projectStore.init(projectPath.value, project, author);
        router.push({ name: RouterNames.ProjectOverviewPage });
      }
    })
}

function submit(values: ProjectInfo) {
  setup(values);
}
</script>
<style lang="scss">
.setup-project {
  text-align: center;
}
</style>

