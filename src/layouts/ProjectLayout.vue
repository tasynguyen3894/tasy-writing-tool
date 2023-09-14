<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated :class="$q.dark.isActive ? 'bg-primary' : 'bg-black'">
      <q-toolbar>
        <q-btn flat @click="leftDrawerOpen = !leftDrawerOpen" round dense icon="menu" />
        <q-toolbar-title>Header</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      :width="200"
      :breakpoint="500"
    >
      <q-scroll-area class="fit">
        <q-list class="menu-list">

          <q-item
            v-for="item in items"
            :key="item.router"
            :active="route.name === item.router"
            @click="redirectTo(item.router)"
            clickable
            v-ripple
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>

            <q-item-section>
              {{ item.label }}
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="exitProject()">
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>

            <q-item-section>
              Exit
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { RouterNames } from 'src/router/routes';
import { useProjectStore } from 'src/stores/projectStore';
import { get } from 'src/util/storage';
import { PROJECT_PATH_KEY } from 'src/util/constant';

export interface MenuItem {
  router: RouterNames,
  label: string,
  icon: string
}

const router = useRouter();
const route = useRoute();

const projectStore = useProjectStore();

const leftDrawerOpen = ref(false);

const items = ref<MenuItem[]>([
  {
    router: RouterNames.ProjectOverviewPage,
    label: 'Overview',
    icon: 'folder'
  },
  {
    router: RouterNames.ProjectCharacterPage,
    label: 'Character',
    icon: 'people'
  },
  {
    router: RouterNames.ProjectObjectPage,
    label: 'Object',
    icon: 'data_object'
  },
  {
    router: RouterNames.ProjectChapterPage,
    label: 'Chapter',
    icon: 'description'
  }
]);


onMounted(() => {
  get(PROJECT_PATH_KEY)
    .then((projectPathInStore: any) => {
      if(projectPathInStore) {
        detectProjectPath(projectPathInStore);
      }
    })
})

function detectProjectPath(projectPathToDetect: string) {
  window.Native.project({ type: 'detect', payload: { path: projectPathToDetect } }).then((res: any) => {
    if(res) {
      window.Native.project({ type: 'getData', payload: { path: projectPathToDetect } })
        .then((res: { key: string, value: string }[]) => {
          const projectInStore = res.find(item => item.key === 'project');
          const authorInStore = res.find(item => item.key === 'author');
          projectStore.init(
            projectPathToDetect,
            projectInStore ? projectInStore.value : '',
            authorInStore ? authorInStore.value : ''
          );
          router.push({ name: RouterNames.ProjectOverviewPage });
        })
    }
  })
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function redirectTo(routeName: RouterNames) {
  router.push({ name: routeName })
}

function exitProject() {
  projectStore.reset();
  router.push({ name: RouterNames.HomePage });
}
</script>
