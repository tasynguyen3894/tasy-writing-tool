<template>
  <div>
    <div>{{ t('group.group') }}</div>
    <q-input
      filled
      v-model="group.title"
      :label="t('group.name')"
      lazy-rules
      :rules="[ val => val && val.length > 0 || 'Please type something']"
    />
    <q-input
      filled
      v-model="group.description"
      :label="t('group.description')"
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
        :disable="group.title.length === 0"
        @click="submit()"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { IGroupCreate } from 'src/models/Group';
import { useDeleteModal } from 'src/hooks/useDeleteModal';

const { t } = useI18n();
const { showDeleteDialog } = useDeleteModal();

const props = withDefaults(defineProps<{
  data?: IGroupCreate & { id?: string },
  hasRemove?: boolean
}>(), {
  hasRemove: false
});

const emits = defineEmits<{
  (e: 'submit', value: IGroupCreate): void,
  (e: 'remove'): void
}>();

const group = ref<IGroupCreate>(props.data || {
  title: '',
  description: ''
});

watch(props, () => {
  if(props.data) {
    group.value = props.data;
  }
});

function submit() {
  emits('submit', {
    title: group.value.title,
    description: group.value.description,
  });
}

function remove() {
  showDeleteDialog(t('common.group').toLocaleLowerCase())
    .then(() => {
      handleRemove();
    });
}

function handleRemove() {
  emits('remove');
}
</script>

