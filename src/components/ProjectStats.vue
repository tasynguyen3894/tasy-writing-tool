<template>
  <div class="row">
    <div class="col-12 stat">
      <div class="stat__header">{{ t('common.character') }}:</div>
      <div>{{ characterStore.characters.length }}</div>
    </div>
    <div class="col-12 stat">
      <div class="stat__header">{{ t('common.chapter') }}:</div>
      <div>{{ chapterStore.chapters.length }}</div>
    </div>
    <div class="col-12 stat">
      <div class="stat__header">{{ t('common.object') }}:</div>
      <div>{{ objectrStore.objects.length }}</div>
    </div>
    <div class="col-12 stat">
      <div class="stat__header">{{ t('common.group') }}:</div>
      <div>{{ groupStore.groups.length }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { useCharacterStore } from 'src/stores/characterStore';
import { useChapterStore } from 'src/stores/chapterStore';
import { useObjectStore } from 'src/stores/objectStore';
import { useGroupStore } from 'src/stores/groupStore';

const { t } = useI18n();

const characterStore = useCharacterStore();
const chapterStore = useChapterStore();
const objectrStore = useObjectStore();
const groupStore = useGroupStore();
</script>
<style scoped lang="scss">
.stat {
  &__header {
    text-transform: capitalize;
    font-weight: bold;
  }
}
</style>

