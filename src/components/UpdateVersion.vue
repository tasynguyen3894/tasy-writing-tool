<template>
  <div class="update-verion" v-if="updattingVersionMessage.length > 0">
    <span>{{ updattingVersionMessage }}</span>
  </div>
</template>
<script lang="ts" setup>
import { watch, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import { useAutoUpdater } from 'src/update/frontend/plugin';
import { UpdateState } from 'src/update/util/constant';

const { t } = useI18n();
const $q = useQuasar();

const {
  updateIsAvailable,
  updateState,
  downloadUpdate,
  updateErrorMessage,
  quitAndInstall,
  checkForUpdates
} = useAutoUpdater();


onMounted(() => {
  checkForUpdates();
})

const updattingVersionMessage = computed<string>(() => {
  if(updateState.value === UpdateState.downloading) {
    return t('common.update_version.installing');
  }
  if(updateErrorMessage.value) {
    return updateErrorMessage.value;
  }
  return '';
});

watch([updateIsAvailable, updateState], () => {
  if( updateState.value === UpdateState.notUpdate  && updateIsAvailable.value === true) {
    downloadUpdate();
  } else if(updateState.value === UpdateState.downloaded) {
    $q.dialog({
        title: t('common.update_version.title'),
        message: t('common.update_version.message'),
        persistent: true,
        ok: t('common.form.update'),
        cancel: t('common.form.cancel')
      }).onOk(() => {
        quitAndInstall();
      });
  }
})
</script>
<style scoped lang="scss">
.update-verion {
  position: absolute;
  bottom: 0px;
  width: 100%;
  z-index: 99999;
  color: #FFF;
  > span {
    padding: 2px;
    padding-right: 10px;
    font-style: italic;
    background: #ccc;
    opacity: 0.7;
  }
}
</style>
