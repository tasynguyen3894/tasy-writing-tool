<template>
  <div class="setting_header_button">
    <q-btn icon="settings" :to="{ name: RouterNames.ProjectSettingPage }" />
  </div>
</template>
<script lang="ts" setup>
import { RouterNames } from 'src/router/routes';
</script>
<style lang="scss" scoped>
.setting_header_button {
  display: inline;
}
</style>
