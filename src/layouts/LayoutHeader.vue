<template>
  <q-header elevated :class="$q.dark.isActive ? 'bg-primary' : 'bg-black'">
    <q-toolbar>
      <q-btn flat @click="emits('clickToHeader')" round dense icon="menu" />
      <q-toolbar-title >
        <div class="title-container">
          <div class="title-container__title">{{ props.title }}</div>
          <div class="title-container__dropdown">
            <LanguageChooser />
          </div>
        </div>
      </q-toolbar-title>
    </q-toolbar>
  </q-header>
</template>
<script setup lang="ts">
import { useQuasar } from 'quasar';

import LanguageChooser from 'src/components/LanguageChooser.vue';

const props = defineProps<{
  title: string
}>();

const emits = defineEmits<{
  (e: 'clickToHeader'): void
}>();

const $q = useQuasar();
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
</style>

