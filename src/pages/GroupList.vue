<template>
  <q-page>
    <div>
      <q-btn icon="add" flat @click="isShowCreateModal = true" />
    </div>
    <CustomTable
      :rows="groups"
      :columns="columns"
    >
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="edit" flat size="0.7em" @click="edit(props.row.id)" />
          <q-btn icon="description" flat size="0.7em" @click="openExportConfigDialog(props.row.id)" />
        </q-td>
      </template>
    </CustomTable>
  </q-page>
  <GroupCreateModal v-model="isShowCreateModal" />
  <GroupExportModal v-model="isShowExportModal" :group-id="groupId" />
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { QTableColumn } from 'quasar';
import { useI18n } from 'vue-i18n';

import { useGroupStore } from 'src/stores/groupStore';
import GroupCreateModal from 'src/components/GroupCreateModal.vue';
import { RouterNames } from 'src/router/routes';
import CustomTable from 'src/components/CustomTable.vue';
import GroupExportModal from 'src/components/GroupExportModal.vue';

const { t } = useI18n();
const router = useRouter();

const groupStore = useGroupStore();
const { groups } = storeToRefs(groupStore);

const columns = computed<QTableColumn[]>(() => [
  {
    field: 'title',
    label: t('group.name'),
    name: 'title'
  },
  {
    field: 'description',
    label: t('group.description'),
    name: 'description'
  },
  {
    field: '',
    label: t('common.table.action'),
    name: 'actions'
  },
]);

const isShowCreateModal = ref<boolean>(false);
const isShowExportModal = ref<boolean>(false);
const groupId = ref<string>();

function edit(id: string) {
  router.push({
    name: RouterNames.ProjectGroupDetailPage,
    params: {
      id
    }
  })
}

function openExportConfigDialog(id: string) {
  isShowExportModal.value = true;
  groupId.value = id;
}
</script>
