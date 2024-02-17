<template>
  <div> 
  </div>
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';
import { useQuasar, QSpinnerGears } from 'quasar';

const $q = useQuasar();

onMounted(() => {
  $q.loading.show({
    spinner: QSpinnerGears
  });
});

onUnmounted(() => {
  $q.loading.hide();
})
</script>
