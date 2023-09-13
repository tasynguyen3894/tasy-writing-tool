<template>
  <q-page>
    <div class="row">
      <div class="col-12">
        <div class="text-h3">{{ project }}</div>
        <div class="text-h6">{{ author }}</div>
      </div>
    </div>
    <ProjectStats />
  </q-page>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';

import { useProjectStore } from 'src/stores/projectStore';

import ProjectStats from 'src/components/ProjectStats.vue';

const projectStore = useProjectStore();
const { project, author } = storeToRefs(projectStore);
</script>

