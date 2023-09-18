<template>
  <q-page>
    <div>
      <q-btn icon="add" flat @click="isShowCreateModal = true" />
    </div>
    <q-table
      :rows="objects"
      :columns="columns"
    >
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="edit" flat size="0.7em" @click="edit(props.row.id)" />
        </q-td>
      </template>
    </q-table>
  </q-page>
  <ObjectCreateModal v-model="isShowCreateModal" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { QTableColumn } from 'quasar';
import { useRouter } from 'vue-router';

import { useObjectStore } from 'src/stores/objectStore';
import ObjectCreateModal from 'src/components/ObjectCreateModal.vue';
import { RouterNames } from 'src/router/routes';


const router = useRouter();
const objectrStore = useObjectStore();
const { objects } = storeToRefs(objectrStore);

const columns: QTableColumn[] = [
  {
    field: 'name',
    label: 'Name',
    name: 'name'
  },
  {
    field: 'type',
    label: 'Type',
    name: 'type'
  },
  {
    field: 'description',
    label: 'Description',
    name: 'description'
  },
  {
    field: '',
    label: 'Action',
    name: 'actions'
  }
];

const isShowCreateModal = ref<boolean>(false);

function edit(id: string) {
  router.push({
    name: RouterNames.ProjectObjectDetailPage,
    params: {
      id
    }
  })
}
</script>
