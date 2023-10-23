<template>
  <q-dialog v-model="isShow">
    <q-card style="min-width: 350px">
      <q-card-section class="row items-center">
        {{ t('character.character_extra') }}
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input :disable="extra.id ? true : false" :rules="[required]" dense v-model="extra.key" :label="t('character.key')" />
        <q-input dense v-model="extra.value" :label="t('character.value')" type="textarea" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="t('common.form.cancel')" v-close-popup />
        <q-btn flat :label="t('common.form.submit')" :disable="required(extra.key) !== true" color="primary" @click="submit()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
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

const { t } = useI18n();

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
