<template>
  <div>
    <div>Meta</div>
    <div><q-btn icon="add" flat @click="startCreateExtra()" /></div>
    <q-table
      :rows="metas"
      :columns="columns"
    >
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="edit" flat size="0.7em" @click="edit(props.row)" />
          <q-btn icon="delete" flat size="0.7em" @click="remove(props.row.id)" />
        </q-td>
      </template>
    </q-table>
  </div>
  <ModifyCharacterExtra
    v-model="isShowModal"
    :data="data"
    @submit="submit"
  />
</template>
<script setup lang="ts">
import { watch, ref } from 'vue';
import { QTableColumn } from 'quasar';
import { useQuasar } from 'quasar';

import { ICharacterExtraRead, ICharacterExtraModify } from 'src/models/CharacterExtra';
import ModifyCharacterExtra from './ModifyCharacterExtra.vue';
import { useCharacterStore } from 'src/stores/characterStore';

const $q = useQuasar();

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

const columns: QTableColumn[] = [
  {
    name: 'key',
    label: 'Key',
    field: 'key'
  },
  {
    name: 'value',
    label: 'Value',
    field: 'value'
  },
  {
    name: 'actions',
    label: 'Actions',
    field: ''
  }
]

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
      $q.notify(value.id ? 'Updated' : 'Created');
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
  $q.dialog({
    title: 'Confirm',
    message: 'Would you want to delete this meta?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    handleRemove(id)
  });
}

function handleRemove(id: string) {
  characterStore.removeExtra(props.characterId, id).then(() => {
    $q.notify('Deleted');
  });
}
</script>
