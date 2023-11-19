<template>
  <div class="update-verion" v-if="updateVersionMessage.length > 0">
    <span>{{ updateVersionMessage }}</span>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const updateVersionMessage = ref<string>('');

onMounted(() => {
  window.UpdateVerion.updateMessage(updateMessage);
});

function updateMessage(_: any, { message, type }: { message: string, type: string }) {
  if(type !== 'update-not-available') {
    updateVersionMessage.value = message;
  }
}
</script>
<style scoped lang="scss">
.update-verion {
  position: fixed;
  bottom: 0px;
  width: 100%;
  > span {
    padding: 2px;
    padding-right: 10px;
    font-style: italic;
    background: #ccc;
    opacity: 0.7;
  }
}
</style>
