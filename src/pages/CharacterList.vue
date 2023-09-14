<template>
  <q-page>
    <div>
      <q-btn icon="add" flat @click="isShowCreateModal = true" />
    </div>
    <q-table
      :rows="characters"
      :columns="columns"
      :pagination="pagination"
    >
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="edit" flat size="0.7em" @click="edit(props.row.id)" />
        </q-td>
      </template>
    </q-table>
  </q-page>
  <CharacterCreateModal v-model="isShowCreateModal" />
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { QTableColumn } from 'quasar';
import { useRouter } from 'vue-router';

import { useCharacterStore } from 'src/stores/characterStore';
import { RouterNames } from 'src/router/routes';
import CharacterCreateModal from 'src/components/CharacterCreateModal.vue';
import { pagination } from 'src/util/constant';

const router = useRouter();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);

const columns: QTableColumn[] = [
  {
    field: 'name',
    label: 'Name',
    name: 'name'
  },
  {
    field: 'alias',
    label: 'Alias',
    name: 'alias'
  },
  {
    field: 'description',
    label: 'Description',
    name: 'description'
  },
  {
    field: '',
    label: 'Actions',
    name: 'actions'
  },
];

const isShowCreateModal = ref<boolean>(false);

function edit(id: string) {
  router.push({
    name: RouterNames.ProjectCharacterDetailPage,
    params: {
      id
    }
  })
}
</script>
