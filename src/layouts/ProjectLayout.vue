<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated :class="$q.dark.isActive ? 'bg-primary' : 'bg-black'">
      <q-toolbar>
        <q-btn flat @click="leftDrawerOpen = !leftDrawerOpen" round dense icon="menu" />
        <q-toolbar-title >
          <div class="title-container">
            <div class="title-container__title">{{ title }}</div>
            <div class="title-container__dropdown">
              <LanguageChooser />
            </div>
          </div>
        </q-toolbar-title>
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
              {{ t('common.' + item.label, item.label) }}
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="exitProject()">
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>

            <q-item-section>
              {{ t('common.exit') }}
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
import { onMounted, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

import { RouterNames } from 'src/router/routes';
import { useProjectStore } from 'src/stores/projectStore';
import { get } from 'src/util/storage';
import { PROJECT_PATH_KEY } from 'src/util/constant';
import { detectProjectPath } from 'src/util/helper';
import LanguageChooser from 'src/components/LanguageChooser.vue';

export interface MenuItem {
  router: RouterNames,
  label: string,
  icon: string
}

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const projectStore = useProjectStore();

const leftDrawerOpen = ref(false);

const title = ref<string>('Application');
const items = ref<MenuItem[]>([
  {
    router: RouterNames.ProjectOverviewPage,
    label: 'overview',
    icon: 'folder'
  },
  {
    router: RouterNames.ProjectCharacterPage,
    label: 'character',
    icon: 'people'
  },
  {
    router: RouterNames.ProjectObjectPage,
    label: 'object',
    icon: 'data_object'
  },
  {
    router: RouterNames.ProjectChapterPage,
    label: 'chapter',
    icon: 'description'
  },
  {
    router: RouterNames.ProjectGroupPage,
    label: 'group',
    icon: 'apps'
  }
]);


onMounted(() => {
  get(PROJECT_PATH_KEY)
    .then((projectPathInStore: any) => {
      if(projectPathInStore && projectStore.project === '') {
        detectProjectPath(projectPathInStore).then((res: any) => {
          if(res) {
            projectStore.getDataProject(projectPathInStore).then(() => {
              router.push({ name: RouterNames.ProjectOverviewPage });
            });
          }
        });
      }
    })
});

watch(() => route.name, () => {
  title.value = t('common.' + (items.value.find(item => item.router === route.name)?.label || ''));
});

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
<style scoped lang="scss">
.title-container {
  text-transform: capitalize;
  &__title {
    display: inline-block;
    width: calc(100% - 95px);
  }
  &__dropdown {
    display: inline-block;
  }
}
.menu-list {
  .q-item__section--main {
    text-transform: capitalize;
  }
}
</style>
