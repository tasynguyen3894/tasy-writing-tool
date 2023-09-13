<template>
  <q-dialog v-model="isShow">
    <q-card style="min-width: 350px">
      <q-card-section class="row items-center">
        Character Extra
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input :disable="extra.id ? true : false" :rules="[required]" dense v-model="extra.key" label="Key" />
        <q-input dense v-model="extra.value" label="Value" type="textarea" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn flat label="Submit" :disable="required(extra.key) !== true" color="primary" @click="submit()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';

import { ICharacterExtraModify } from 'src/models/CharacterExtra';
import { required } from 'src/util/helper';

const props = defineProps<{
  modelValue: boolean,
  data: ICharacterExtraModify | undefined
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void,
  (e: 'submit', value: ICharacterExtraModify): void
}>();

const isShow = ref<boolean>(props.modelValue);
const extra = ref<ICharacterExtraModify>(props.data || {
  key: '',
  value: ''
});

watch(isShow, () => {
  emits('update:modelValue', isShow.value);
});

watch(props, () => {
  isShow.value = props.modelValue;
  extra.value = props.data || {
    key: '',
    value: ''
  }
});

function submit() {
  emits('submit', extra.value);
}
</script>
