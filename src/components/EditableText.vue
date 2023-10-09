<template>
  <div class="editable">
    <span class="editable__text">
      <template v-if="!isEditing">{{ props.text }}</template>
      <input v-else type="text" v-model="content" >
    </span>
    <span class="editable_button">
      <q-btn v-if="isEditing" flat icon="close" @click="isEditing = false" />
      <q-btn v-else flat icon="edit" @click="startToEdit()" />
    </span>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const props = withDefaults(defineProps<{
  text: string
}>(), {
  text: ''
});

const isEditing = ref<boolean>(false);
const content = ref<string>(props.text);

function startToEdit() {
  content.value = props.text;
  isEditing.value = true;
}
</script>
<style lang="scss" scoped>
.editable {
  &__text {
    max-width: calc(100% - 60px);
  }
  &__button {
    display: none;
    &--editable {
      
    }
  }
}
</style>
