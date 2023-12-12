<template>
  <div class="update-verion" v-if="updattingVersionMessage.length > 0">
    <span>{{ updattingVersionMessage }}</span>
  </div>
</template>
<script lang="ts" setup>
import { watch, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';

import { useAutoUpdater } from 'src/update/frontend/plugin';
import { UpdateState } from 'src/update/util/constant';

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
    return 'Installing new update version...';
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
        title: 'Update',
        message: 'Do you want to install and update?',
        persistent: true,
        cancel: true,
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
