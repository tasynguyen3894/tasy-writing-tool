<template>
  <router-view />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { onMounted } from 'vue';

import { STORAGE_LANGUAGE } from 'src/boot/i18n';
import { get } from 'src/util/storage';

const { locale } = useI18n();

onMounted(() => {
  get(STORAGE_LANGUAGE).then((lang: undefined | string) => {
    if(lang) {
      locale.value = lang;
    }
  })
})
</script>
