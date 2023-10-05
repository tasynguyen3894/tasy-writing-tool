<template>
  <q-page>
    <div>
      <q-btn icon="add" flat @click="isShowCreateModal = true" />
    </div>
    <q-table
      :rows="groups"
      :columns="columns"
    >
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="edit" flat size="0.7em" @click="edit(props.row.id)" />
        </q-td>
      </template>
    </q-table>
  </q-page>
  <GroupCreateModal v-model="isShowCreateModal" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { QTableColumn } from 'quasar';

import { useGroupStore } from 'src/stores/groupStore';
import GroupCreateModal from 'src/components/GroupCreateModal.vue';
import { RouterNames } from 'src/router/routes';

const router = useRouter();

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
    name: RouterNames.ProjectGroupDetailPage,
    params: {
      id
    }
  })
}
</script>
