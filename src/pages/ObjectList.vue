<template>
  <q-page>
    <div>
      <q-btn icon="add" flat @click="isShowCreateModal = true" />
    </div>
    <q-table
      :rows="objects"
      :columns="columns"
    />
  </q-page>
  <ObjectCreateModal v-model="isShowCreateModal" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { QTableColumn } from 'quasar';

import { useObjectrStore } from 'src/stores/objectStore';
import ObjectCreateModal from 'src/components/ObjectCreateModal.vue';

const objectrStore = useObjectrStore();
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

</script>
