<template>
  <div class="setting_header_button">
    <q-btn icon="settings" :to="{ name: props.isInProject ? RouterNames.ProjectSettingPage : RouterNames.NonProjectSettingPage }" />
  </div>
</template>
<script lang="ts" setup>
import { RouterNames } from 'src/router/routes';

const props = withDefaults(defineProps<{
  isInProject: boolean
}>(), {
  isInProject: false
})
</script>
<style lang="scss" scoped>
.setting_header_button {
  display: inline;
}
</style>
