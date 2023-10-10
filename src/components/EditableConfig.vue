<template>
  <div :class="['editable', { 'editable--edited': isEditing }]">
    <span class="editable__text">
      <template v-if="!isEditing">{{ props.text }}</template>
      <input v-else type="text" v-model="content" >
    </span>
    <span class="editable__button">
      <template v-if="isEditing" >
        <q-btn flat icon="save" @click="updateConfigKey()" />
        <q-btn flat icon="close" @click="stopEdit()" />
      </template>
      <q-btn v-else flat icon="edit" @click="startToEdit()" />
    </span>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';

import { ConfigKey } from 'src/models/Config';
import { useProjectStore } from 'src/stores/projectStore';

const props = withDefaults(defineProps<{
  text: string,
  configKey: ConfigKey
}>(), {
  text: ''
});

const $q = useQuasar();

const isEditing = ref<boolean>(false);
const content = ref<string>(props.text);

function startToEdit() {
  content.value = props.text;
  isEditing.value = true;
}

function stopEdit() {
  isEditing.value = false;
}

function updateConfigKey() {
  useProjectStore().updateConfig(props.configKey, content.value).then(() => {
    stopEdit();
    $q.notify('Updated');
  });
}
</script>
<style lang="scss" scoped>
.editable {
  &__text {
    max-width: calc(100% - 60px);
    input {
      max-width: 100%;
    }
  }
  &__button {
    display: none;
  }
  &--edited &__button {
    display: inline-block;
  }
  &--edited &__text {
    display: inline-block;
    max-width: calc(100% - 130px);
  }
  &:hover &__button {
    display: inline-block;
  }
}
</style>
