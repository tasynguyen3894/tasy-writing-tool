<template>
  <div>
    <div>{{ t('character.information') }}</div>
    <q-input
      filled
      v-model="character.name"
      :label="t('character.name')"
      lazy-rules
      :rules="[ val => val && val.length > 0 || 'Please type something']"
    />
    <q-input
      filled
      v-model="character.alias"
      :label="t('character.alias')"
      lazy-rules
      :rules="[ val => val && val.length > 0 || 'Please type something']"
    />
    <q-input
      filled
      v-model="character.hint"
      :label="t('character.hint')"
      lazy-rules
      bottom-slots
    />
    <q-input
      filled
      v-model="character.description"
      :label="t('character.description')"
      type="textarea"
      lazy-rules
    />
    <div class="q-pt-md" align="right">
      <q-btn
        v-if="props.hasRemove"
        :label="t('common.form.delete')"
        flat
        @click="remove()"
      />
      <q-btn
        :label="(props.data && props.data.id) ? t('common.form.update') : t('common.form.create')"
        color="primary"
        :disable="character.alias.length === 0 || character.name.length === 0"
        @click="submit()"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';

import { ICharacterCreate } from 'src/models/Character';

const { t } = useI18n();
const $q = useQuasar();

const props = withDefaults(defineProps<{
  data?: ICharacterCreate & { id?: string },
  hasRemove?: boolean
}>(), {
  hasRemove: false
});

const emits = defineEmits<{
  (e: 'submit', value: ICharacterCreate): void,
  (e: 'remove'): void
}>();

const character = ref<ICharacterCreate>(props.data || {
  name: '',
  alias: '',
  hint: '',
  description: ''
});

watch(props, () => {
  if(props.data) {
    character.value = props.data;
  }
});

function submit() {
  emits('submit', {
    name: character.value.name,
    alias: character.value.alias,
    hint: character.value.hint,
    description: character.value.description,
  });
}

function remove() {
  $q.dialog({
    title: 'Confirm',
    message: 'Would you want to delete this meta?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    handleRemove()
  });
}

function handleRemove() {
  emits('remove');
}
</script>

