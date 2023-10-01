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
          <q-btn icon="description" flat size="0.7em" @click="openExportConfigDialog(props.row.id)" />
        </q-td>
      </template>
    </q-table>
  </q-page>
  <ChapterExportModal v-model="isShow" :chapter-id="chapterId" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { QTableColumn } from 'quasar';
import { useRouter } from 'vue-router';

import { useChapterStore } from 'src/stores/chapterStore';
import { RouterNames } from 'src/router/routes';
import ChapterExportModal from 'src/components/ChapterExportModal.vue';

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

const isShow = ref<boolean>(false);
const chapterId = ref<string>();

function edit(id: string) {
  router.push({
    name: RouterNames.ProjectChapterDetailPage,
    params: {
      id
    }
  })
}

function openExportConfigDialog(id: string) {
  isShow.value = true;
  chapterId.value = id;
}
</script>
