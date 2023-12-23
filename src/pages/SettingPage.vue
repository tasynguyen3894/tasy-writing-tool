<template>
  <q-page class="row items-center justify-evenly">
    <div style="text-align: center;"  v-if="updateIsAvailable">
      <div>{{ t('common.update_version.available') }}</div>
      <q-btn :label="label" @click="updateVersion()" :loading="updateState === UpdateState.downloading" />
    </div>
  </q-page>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

import { useAutoUpdater, UpdateState } from 'src/update';

const { t } = useI18n();

const { updateIsAvailable, updateState, downloadUpdate } = useAutoUpdater();

const label = computed<string | undefined>(() => {
  if(updateState.value === UpdateState.downloading) {
    return t('common.update_version.installing');
  }
  if(updateIsAvailable.value) {
    return t('common.update_version.update');
  }
  return undefined;
});

function updateVersion() {
  downloadUpdate();
}
</script>
