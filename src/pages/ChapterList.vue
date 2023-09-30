<template>
  <q-page>
    <div>
      <q-btn icon="add" :to="{ name: RouterNames.ProjectWriteChapterPage }" />
    </div>
    <q-table
      :rows="chapters"
      :columns="columns"
    >
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="edit" flat size="0.7em" @click="edit(props.row.id)" />
          <q-btn icon="description" flat size="0.7em" @click="exportChapter(props.row.id)" />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { QTableColumn, useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

import { useChapterStore } from 'src/stores/chapterStore';
import { RouterNames } from 'src/router/routes';

const $q = useQuasar();
const router = useRouter();

const chapterStore = useChapterStore();
const { chapters } = storeToRefs(chapterStore);

const columns: QTableColumn[] = [
  {
    field: 'title',
    label: 'Title',
    name: 'title'
  },
  {
    field: 'status',
    label: 'Status',
    name: 'status'
  },
  {
    field: 'description',
    label: 'Description',
    name: 'description',
  },
  {
    field: '',
    label: 'Action',
    name: 'actions'
  }
];

function edit(id: string) {
  router.push({
    name: RouterNames.ProjectChapterDetailPage,
    params: {
      id
    }
  })
}

function openExportDialog(): Promise<string> {
  return new Promise((resolve, reject) => {
    window.Native.export().then((data: any) => {
      if(data.filePath) {
        resolve(data.filePath);
      }
    }).catch(error => {
      reject(error);
    })
  });
}

function exportChapter(id: string) {
  openExportDialog().then(url => {
    chapterStore.exportChapter(id, url).then(result => {
      $q.notify('Updated');
    })
  })
}
</script>
