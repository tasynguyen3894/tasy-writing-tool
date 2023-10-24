<template>
  <q-page>
    <div>
      <q-btn icon="add" flat @click="isShowCreateModal = true" />
    </div>
    <CustomTable
      :rows="objects"
      :columns="columns"
    >
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="edit" flat size="0.7em" @click="edit(props.row.id)" />
        </q-td>
      </template>
    </CustomTable>
  </q-page>
  <ObjectCreateModal v-model="isShowCreateModal" />
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { QTableColumn } from 'quasar';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import { useObjectStore } from 'src/stores/objectStore';
import ObjectCreateModal from 'src/components/ObjectCreateModal.vue';
import { RouterNames } from 'src/router/routes';
import CustomTable from 'src/components/CustomTable.vue';

const { t } = useI18n();
const router = useRouter();
const objectrStore = useObjectStore();
const { objects } = storeToRefs(objectrStore);

const columns = computed<QTableColumn[]>(() => [
  {
    field: 'name',
    label: t('object.name'),
    name: 'name'
  },
  {
    field: 'type',
    label: t('object.type'),
    name: 'type'
  },
  {
    field: 'description',
    label: t('object.description'),
    name: 'description'
  },
  {
    field: '',
    label: t(('common.table.action')),
    name: 'actions'
  }
]);

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
