<template>
  <LoadingScreen v-if="!checkedCurrentProject" />
  <router-view v-else />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { onMounted } from 'vue';
import { ref } from 'vue';

import { STORAGE_LANGUAGE } from 'src/boot/i18n';
import { get } from 'src/util/storage';
import { useAutoUpdater } from 'vue-electron-updater/vue';
import { useCheckCurrentProject } from 'src/hooks/useCheckCurrentProject';
import LoadingScreen from 'src/components/LoadingScreen.vue';


const { locale } = useI18n();

const { startListen } = useAutoUpdater();
const { check } = useCheckCurrentProject();
const checkedCurrentProject = ref<boolean>(false);

onMounted(() => {
  get(STORAGE_LANGUAGE).then((lang: undefined | string) => {
    if(lang) {
      locale.value = lang;
    }
  });
  check().finally(() => {
    checkedCurrentProject.value = true;
  })
  startListen();
})
</script>
