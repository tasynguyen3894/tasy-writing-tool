<template>
  <div>
    <div>{{ t('object.information') }}</div>
    <q-input
      filled
      v-model="object.name"
      :label="t('object.name')"
      lazy-rules
      :rules="[ val => val && val.length > 0 || 'Please type something']"
    />
    <q-input
      filled
      v-model="object.type"
      :label="t('object.type')"
      lazy-rules
      :rules="[ val => val && val.length > 0 || 'Please type something']"
    />
    <q-input
      filled
      v-model="object.alias"
      :label="t('object.alias')"
      lazy-rules
      :rules="[ val => val && val.length > 0 || 'Please type something']"
    />
    <q-input
      filled
      v-model="object.hint"
      :label="t('object.hint')"
      lazy-rules
      bottom-slots
    />
    <q-input
      filled
      v-model="object.description"
      :label="t('object.description')"
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
        :disable="object.alias.length === 0 || object.name.length === 0"
        @click="submit()"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { IObjectCreate } from 'src/models/Object';
import { useConfirmModal } from 'src/hooks/useConfirmModal';

const { t } = useI18n();
const { showDeleteDialog } = useConfirmModal();

const props = withDefaults(defineProps<{
  data?: IObjectCreate & { id?: string },
  hasRemove?: boolean
}>(), {
  hasRemove: false
});

const emits = defineEmits<{
  (e: 'submit', value: IObjectCreate): void,
  (e: 'remove'): void
}>();

const object = ref<IObjectCreate>(props.data || {
  name: '',
  alias: '',
  hint: '',
  description: '',
  type: ''
});

watch(props, () => {
  if(props.data) {
    object.value = props.data;
  }
});

function submit() {
  emits('submit', {
    name: object.value.name,
    alias: object.value.alias,
    hint: object.value.hint,
    description: object.value.description,
    type: object.value.type
  });
}

function remove() {
  showDeleteDialog(t('common.object').toLocaleLowerCase())
  .then(() => {
      handleRemove();
    });
}

function handleRemove() {
  emits('remove');
}
</script>

