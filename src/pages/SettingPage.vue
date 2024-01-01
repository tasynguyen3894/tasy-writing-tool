<template>
  <q-page class="row items-center justify-evenly">
    <q-card style="min-width: 350px">
      <q-card-section>
        <LeftRightFormRow>
          <template #left>
            {{ t('common.update_version.auto_download_new_version') }}
          </template>
          <template #right>
            <q-toggle v-model="turnOnAutoDownload" />
          </template>
        </LeftRightFormRow>
        <LeftRightFormRow>
          <template #left>
            {{ updateIsAvailable ? t('common.update_version.available') : t('common.update_version.non_available') }}
          </template>
          <template #right>
            <q-btn flat color="primary" :label="label" @click="updateIsAvailable ? updateVersion() : handleCheckForUpdate()" :loading="actionButtonLoading" />
          </template>
        </LeftRightFormRow>
        <div class="q-pt-md" align="right">
          <q-btn :label="t('common.back')" :to="{ name: useProjectStore().projectPath !== null ? RouterNames.ProjectOverviewPage : RouterNames.HomePage }" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { computed, onMounted, ref, watch } from 'vue';

import { useAutoUpdater, UpdateState } from 'src/update';
import { useProjectStore } from 'src/stores/projectStore';
import { RouterNames } from 'src/router/routes';
import { get, set } from 'src/util/storage';
import LeftRightFormRow from 'src/components/LeftRightFormRow.vue';
import { TURN_ON_AUTO_DOWNLOAD_UPDATE } from 'src/util/constant';

const { t } = useI18n();

const { updateIsAvailable, updateState, downloadUpdate, checkForUpdates } = useAutoUpdater();

const turnOnAutoDownload = ref<boolean>(false);
const isCheckingUpdate = ref<boolean>(false);

const label = computed<string | undefined>(() => {
  if(updateState.value === UpdateState.downloading) {
    return t('common.update_version.installing');
  }
  if(updateIsAvailable.value) {
    return t('common.update_version.update');
  }
  return t('common.update_version.check_for_update');
});

const actionButtonLoading = computed<boolean>(() => {
  if(updateIsAvailable.value) {
    return updateState.value === UpdateState.downloading;
  }
  return isCheckingUpdate.value;
});

onMounted(() => {
  get(TURN_ON_AUTO_DOWNLOAD_UPDATE).then(result => {
    turnOnAutoDownload.value = result === 'true';
  })
})

watch(turnOnAutoDownload, () => {
  set(TURN_ON_AUTO_DOWNLOAD_UPDATE, turnOnAutoDownload.value ? 'true' : 'false');
});

watch(updateIsAvailable, () => {
  if(updateIsAvailable.value === undefined) {
    isCheckingUpdate.value = true;
  }
  return false;
});

function handleCheckForUpdate() {
  isCheckingUpdate.value = true;
  checkForUpdates();
}

function updateVersion() {
  downloadUpdate();
}
</script>
