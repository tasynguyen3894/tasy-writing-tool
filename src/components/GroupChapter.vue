<template>
  <div v-if="group">
    <div style="text-transform: capitalize;">{{ t('common.chapter') }}</div>
    <div><q-btn icon="add" flat @click="isShow = true" /></div>
    <q-table
      :rows="groupChapters"
      :columns="columns"
    >
      <template #body-cell-status="props">
        <q-td :props="props">
          {{ t('chapter.status.' + props.row.status, props.row.status) }}
        </q-td>
      </template>
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="delete" flat size="0.7em" @click="removeChapter(props.row.id)" />
        </q-td>
      </template>
    </q-table>
    <AddChapterIntoGroupModal
      v-model="isShow"
      :group-id="props.groupId"
    />
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { QTableColumn, useQuasar } from 'quasar';
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';

import { IChapterRead } from 'src/models/Chapter';
import { useChapterStore } from 'src/stores/chapterStore';
import { useGroupStore } from 'src/stores/groupStore';
import { IGroupRead } from 'src/models/Group';
import AddChapterIntoGroupModal from 'src/components/AddChapterIntoGroupModal.vue';

const props = defineProps<{
  groupId: string
}>();

const { t } = useI18n();
const $q = useQuasar();

const groupStore = useGroupStore();
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

const group = computed<IGroupRead | undefined>(() => {
  return groupStore.findGroup(props.groupId);
})

const groupChapters = computed<IChapterRead[]>(() => {
  return chapters.value.filter(({ id }) => group.value && group.value.chapters.some(chapter => id !== chapter.id) ? true : false);
});

function handleRemove(chapterId: string) {
  groupStore.removeChapter(props.groupId, chapterId).then(() => {
    $q.notify('Deleted');
  })
}

function removeChapter(chapterId: string) {
  $q.dialog({
    title: 'Confirm',
    message: 'Would you want to delete this chapter?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    handleRemove(chapterId)
  });
}
</script>
