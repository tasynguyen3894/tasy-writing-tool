<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated :class="$q.dark.isActive ? 'bg-primary' : 'bg-black'">
      <q-toolbar>
        <q-toolbar-title >
          <div>Tasy Writing Tool</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    
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

const appVersion = APP_VERSION;
</script>
<style scoped lang="scss">
.footer {
  text-align: center;
  font-size: 12px;
}
</style>
