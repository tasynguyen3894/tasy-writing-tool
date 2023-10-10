<template>
  <q-page>
    <div class="row">
      <div class="col-12">
        <div class="text-h3">
          <EditableConfig :text="project" :config-key="ConfigKey.project" />
        </div>
        <div class="text-h6">
          <EditableConfig :text="author" :config-key="ConfigKey.author" />
        </div>
      </div>
    </div>
    <ProjectStats />
  </q-page>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';

import { useProjectStore } from 'src/stores/projectStore';
import EditableConfig from 'src/components/EditableConfig.vue';
import ProjectStats from 'src/components/ProjectStats.vue';
import { ConfigKey } from 'src/models/Config';

const projectStore = useProjectStore();
const { project, author } = storeToRefs(projectStore);
</script>
