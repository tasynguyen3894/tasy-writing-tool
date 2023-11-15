<template>
  <div v-if="group">
    <div style="text-transform: capitalize;">{{ t('common.chapter') }}</div>
    <div>
      <q-btn icon="add" flat @click="isShow = true" />
      <q-btn icon="sort" flat @click="openSortModal()" />
    </div>
    <q-table
      :rows="groupChapters"
      :columns="columns"
      :rows-per-page-options="[0]"
    >
      <template #body-cell-status="props">
        <q-td :props="props">
          {{ t('chapter.status.' + props.row.status, props.row.status) }}
        </q-td>
      </template>
      <template #body-cell-actions="cellProps">
        <q-td :props="cellProps">
          <q-btn icon="delete" flat size="0.7em" @click="removeChapter(cellProps.row.id)" />
        </q-td>
      </template>
    </q-table>
    
    <AddChapterIntoGroupModal
      v-model="isShow"
      :group-id="props.groupId"
    />
    <SortChapterModal
      v-model="isShowSortModal"
      :sort-items="sortableItems"
      @submit="handleSort"
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
import SortChapterModal, { SortItem } from 'src/components/SortChapterModal.vue';

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
const isShowSortModal = ref<boolean>(false);

const group = computed<IGroupRead | undefined>(() => {
  return groupStore.findGroup(props.groupId);
});

const sortableItems = ref<SortItem[]>([]);

const groupChapters = computed<Array<IChapterRead & { order: number | null }>>(() => {
  if(!group.value) {
    return [];
  }

  const result: Array<IChapterRead & { order: number | null }> = []; 

  group.value.chapters.forEach(groupChapter => {
    const chapter = chapters.value.find(chapter => chapter.id === groupChapter.id);
    if(chapter) {
      result.push({
        ...chapter,
        order: groupChapter.order
      });
    }
  })

  return result.sort((a, b) => { return (a.order || -1) > (b.order || -1) ? 1 : -1; });
});

function handleRemove(chapterId: string) {
  groupStore.removeChapter(props.groupId, chapterId).then(() => {
    $q.notify(t('common.form.deleted'));
  })
}

function openSortModal() {
  sortableItems.value = groupChapters.value.map(item => {
    return {
      id: item.id,
      title: item.title,
      order: item.order ? item.order : -1
    }
  });
  isShowSortModal.value = true;
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

function handleSort(items: SortItem[]) {
  const sortChapterPromises: Promise<boolean>[] = [];
  items.forEach((item, index) => {
    sortChapterPromises.push(groupStore.updateChapterOrder(props.groupId, item.id, index + 1));
  });
  Promise.all(sortChapterPromises).then(() => {
    $q.notify(t('common.form.sorted'));
    isShowSortModal.value = false;
  })
}
</script>
