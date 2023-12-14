<template>
  <q-layout view="lHh Lpr lFf">
    <LayoutHeader
      title="Tasy Writing Tool"
    />
    <q-page-container>
      <router-view />
    </q-page-container>
    <UpdateVersion />
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
import UpdateVersion from 'src/components/UpdateVersion.vue';
import LayoutHeader from 'src/layouts/LayoutHeader.vue';

const appVersion = APP_VERSION;
</script>
<style scoped lang="scss">
.footer {
  text-align: center;
  font-size: 12px;
}
</style>
