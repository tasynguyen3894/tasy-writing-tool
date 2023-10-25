<template>
  <q-page>
    <div>
      <q-btn icon="add" :to="{ name: RouterNames.ProjectWriteChapterPage }" />
    </div>
    <CustomTable
      :rows="chapters"
      :columns="columns"
    >
      <template #body-cell-status="props">
        <q-td :props="props">
          {{ t('chapter.status.' + props.row.status, props.row.status) }}
        </q-td>
      </template>
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="edit" flat size="0.7em" @click="edit(props.row.id)" />
          <q-btn icon="description" flat size="0.7em" @click="openExportConfigDialog(props.row.id)" />
        </q-td>
      </template>
    </CustomTable>
  </q-page>
  <ChapterExportModal v-model="isShow" :chapter-id="chapterId" />
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { QTableColumn } from 'quasar';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import { useChapterStore } from 'src/stores/chapterStore';
import { RouterNames } from 'src/router/routes';
import ChapterExportModal from 'src/components/ChapterExportModal.vue';
import CustomTable from 'src/components/CustomTable.vue';

const { t } = useI18n();
const router = useRouter();

const chapterStore = useChapterStore();
const { chapters } = storeToRefs(chapterStore);

const columns = computed<QTableColumn[]>(() => [
  {
    field: 'title',
    label: t('chapter.attribute.title'),
    name: 'title'
  },
  {
    field: 'status',
    label: t('chapter.attribute.status'),
    name: 'status'
  },
  {
    field: 'description',
    label: t('chapter.attribute.description'),
    name: 'description',
  },
  {
    field: '',
    label: t('common.table.action'),
    name: 'actions'
  }
]);

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
