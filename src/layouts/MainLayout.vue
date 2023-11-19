<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated :class="$q.dark.isActive ? 'bg-primary' : 'bg-black'">
      <q-toolbar>
        <q-toolbar-title >
          Writing tool {{ appVersion }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    
    <q-page-container>
      <router-view />
    </q-page-container>
    <UpdateVersion />
  </q-layout>
</template>

<script setup lang="ts">
import UpdateVersion from 'src/components/UpdateVersion.vue';

const appVersion = APP_VERSION;
</script>
