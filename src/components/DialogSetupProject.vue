<template>
  <q-dialog v-model="isShow" persistent>
    <q-card style="min-width: 350px">
      <q-form ref="form">
        <q-card-section>
          <div class="text-h6">Your address</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="project" :rules="[required]" label="Project name" />
          <q-input v-model="author" :rules="[required]" label="Author" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Create" @click="submit()" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';

export interface ProjectInfo {
  project: string,
  author: string
}

function required(value: any): boolean | string {
  return value.length > 0 ? true : 'Required';
} 

const props = withDefaults(defineProps<{
  modelValue: boolean
}>(), {
  modelValue: false
});

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void,
  (e: 'submit', value: ProjectInfo): void
}>();

const isShow = ref<boolean>(props.modelValue);
const project = ref<string>('');
const author = ref<string>('');
const form = ref<null | { validate: () => Promise<boolean> }>(null);

watch(isShow, () => {
  emits('update:modelValue', isShow.value);
});

watch(props, () => {
  if(props.modelValue !== isShow.value) {
    isShow.value = props.modelValue;
  }
});

function submit() {
  if(form.value) {
    form.value.validate().then(success => {
      emits('submit', {
        project: project.value,
        author: author.value
      });
      isShow.value = false;
    })
  }
}
</script>
