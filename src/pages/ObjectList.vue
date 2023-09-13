<template>
  <q-page>
    <q-table
      :rows="objects"
      :columns="columns"
    />
  </q-page>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { QTableColumn } from 'quasar';

import { useObjectrStore } from 'src/stores/objectStore';

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
];
</script>
