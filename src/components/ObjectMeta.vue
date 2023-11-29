<template>
  <div>
    <div>{{ t('object.object_extra') }}</div>
    <div><q-btn icon="add" flat @click="startCreateExtra()" /></div>
    <CustomTable
      :rows="metas"
      :columns="columns"
    >
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="edit" flat size="0.7em" @click="edit(props.row)" />
          <q-btn icon="delete" flat size="0.7em" @click="remove(props.row.id)" />
        </q-td>
      </template>
    </CustomTable>
  </div>
  <ModifyCharacterExtra
    v-model="isShowModal"
    :data="data"
    @submit="submit"
  />
</template>
<script setup lang="ts">
import { watch, ref, computed } from 'vue';
import { QTableColumn } from 'quasar';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import { IObjectExtraRead, IObjectExtraModify } from 'src/models/ObjectExtra';
import ModifyCharacterExtra from './ModifyCharacterExtra.vue';
import { useObjectStore } from 'src/stores/objectStore';
import CustomTable from 'src/components/CustomTable.vue';
import { useConfirmModal } from 'src/hooks/useConfirmModal';

const { t } = useI18n();
const $q = useQuasar();
const { showDeleteDialog } = useConfirmModal();

const props = withDefaults(defineProps<{
  modelValue: IObjectExtraRead[],
  objectId: string
}>(), {
  modelValue: () => []
});

const emits = defineEmits<{
  (e: 'update:modelValue', value: IObjectExtraRead[]): void
}>();

const objectStore = useObjectStore();

const columns = computed<QTableColumn[]>(() => [
  {
    name: 'key',
    label: t('object.key'),
    field: 'key'
  },
  {
    name: 'value',
    label: t('object.value'),
    field: 'value'
  },
  {
    name: 'actions',
    label: t('common.table.action'),
    field: ''
  }
]);

const data = ref<IObjectExtraModify>({
  key: '',
  value: ''
});
const isShowModal = ref<boolean>(false);
const metas = ref<IObjectExtraRead[]>(props.modelValue);

watch(metas, () => {
  emits('update:modelValue', metas.value);
});

watch(props, () => {
  metas.value = props.modelValue;
});

function startCreateExtra() {
  data.value = {
    key: '',
    value: ''
  };
  isShowModal.value = true;
}

function submit(value: IObjectExtraModify) {
  if(props.objectId) {
    objectStore.createExtra({
      ...value,
      object_id: props.objectId
    }).then(() => {
      isShowModal.value = false;
      $q.notify(value.id ? t('common.form.updated') : t('common.form.created'));
    })
  }
}

function edit(row: IObjectExtraRead) {
  data.value = {
    id: row.id,
    key: row.key,
    value: row.value
  }
  isShowModal.value = true;
}

function remove(id: string) {
  showDeleteDialog(t('character.character_extra').toLocaleLowerCase())
    .then(() => {
      handleRemove(id);
    });
}

function handleRemove(id: string) {
  objectStore.removeExtra(props.objectId, id).then(() => {
    $q.notify(t('common.form.deleted'));
  });
}
</script>
