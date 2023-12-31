<template>
  <q-layout view="lHh Lpr lFf">
    <LayoutHeader
      :title="pageTitle"
      hasToggleButton
      @clickToHeader="leftDrawerOpen = !leftDrawerOpen"
    />
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
    <UpdateVersion v-if="isAutoUpdateApplication" />
  </q-layout>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

import { RouterNames } from 'src/router/routes';
import { useProjectStore } from 'src/stores/projectStore';
import { get } from 'src/util/storage';
import { PROJECT_PATH_KEY, TURN_ON_AUTO_DOWNLOAD_UPDATE } from 'src/util/constant';
import { detectProjectPath } from 'src/util/helper';
import LayoutHeader from 'src/layouts/LayoutHeader.vue';
import UpdateVersion from 'src/components/UpdateVersion.vue'
import { usePageTitle } from 'src/hooks/usePageTitle';

export interface MenuItem {
  router: RouterNames,
  label: string,
  icon: string
}

const { t } = useI18n();
const { pageTitle } = usePageTitle();
const router = useRouter();
const route = useRoute();

const projectStore = useProjectStore();

const leftDrawerOpen = ref(false);
const isAutoUpdateApplication = ref<boolean>(false);

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

  get(TURN_ON_AUTO_DOWNLOAD_UPDATE).then(result => {
    isAutoUpdateApplication.value = result === 'true';
  })
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
