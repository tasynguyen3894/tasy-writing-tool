<template>
  <q-layout view="lHh Lpr lFf">
    <LayoutHeader
      :title="pageTitle"
    />
    <q-page-container>
      <router-view />
    </q-page-container>
    <UpdateVersion v-if="isAutoUpdateApplication" />
    <q-footer reveal elevated class="bg-black">
      <q-toolbar>
        <q-toolbar-title>
          <div class="footer">V{{ appVersion }}</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import UpdateVersion from 'src/components/UpdateVersion.vue';
import LayoutHeader from 'src/layouts/LayoutHeader.vue';
import { usePageTitle } from 'src/hooks/usePageTitle';
import { TURN_ON_AUTO_DOWNLOAD_UPDATE } from 'src/util/constant';
import { get } from 'src/util/storage';

const { pageTitle } = usePageTitle();
const appVersion = APP_VERSION;

const isAutoUpdateApplication = ref<boolean>(false);

onMounted(() => {
  get(TURN_ON_AUTO_DOWNLOAD_UPDATE).then(result => {
    isAutoUpdateApplication.value = result === 'true';
  })
})
</script>
<style scoped lang="scss">
.footer {
  text-align: center;
  font-size: 12px;
}
</style>
