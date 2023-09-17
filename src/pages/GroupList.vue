<template>
  <q-page>
    <div>
      <q-btn icon="add" flat />
    </div>
    <q-table
      :rows="groups"
      :columns="columns"
    />
  </q-page>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { QTableColumn } from 'quasar';

import { useGroupStore } from 'src/stores/groupStore';

const groupStore = useGroupStore();
const { groups } = storeToRefs(groupStore);

const columns: QTableColumn[] = [
  {
    field: 'title',
    label: 'Title',
    name: 'title'
  },
  {
    field: 'description',
    label: 'Description',
    name: 'description'
  }
];
</script>
