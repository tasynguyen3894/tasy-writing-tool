<template>
  <div>
    <div>{{ t('character.character_extra') }}</div>
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

import { ICharacterExtraRead, ICharacterExtraModify } from 'src/models/CharacterExtra';
import ModifyCharacterExtra from './ModifyCharacterExtra.vue';
import { useCharacterStore } from 'src/stores/characterStore';
import CustomTable from 'src/components/CustomTable.vue';
import { useConfirmModal } from 'src/hooks/useConfirmModal';

const { t } = useI18n();
const $q = useQuasar();
const { showDeleteDialog } = useConfirmModal();

const props = withDefaults(defineProps<{
  modelValue: ICharacterExtraRead[],
  characterId: string
}>(), {
  modelValue: () => []
});

const emits = defineEmits<{
  (e: 'update:modelValue', value: ICharacterExtraRead[]): void
}>();

const characterStore = useCharacterStore();

const columns = computed<QTableColumn[]>(() => [
  {
    name: 'key',
    label: t('character.key'),
    field: 'key'
  },
  {
    name: 'value',
    label: t('character.value'),
    field: 'value'
  },
  {
    name: 'actions',
    label: t('common.table.action'),
    field: ''
  }
]);

const data = ref<ICharacterExtraModify>({
  key: '',
  value: ''
});
const isShowModal = ref<boolean>(false);
const metas = ref<ICharacterExtraRead[]>(props.modelValue);

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

function submit(value: ICharacterExtraModify) {
  if(props.characterId) {
    characterStore.createExtra({
      ...value,
      character_id: props.characterId
    }).then(() => {
      isShowModal.value = false;
      $q.notify(value.id ? t('common.form.updated') : t('common.form.created'));
    })
  }
}

function edit(row: ICharacterExtraRead) {
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
  characterStore.removeExtra(props.characterId, id).then(() => {
    $q.notify(t('common.form.deleted'));
  });
}
</script>
