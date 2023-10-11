<template>
  <div v-if="group">
    <div>Chapter</div>
    <div><q-btn icon="add" flat /></div>
    <q-table
      :rows="groupChapters"
      :columns="columns"
    >
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="view" flat size="0.7em" />
        </q-td>
      </template>
    </q-table>
  </div>
</template>
<script setup lang="ts">
import { QTableColumn } from 'quasar';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { IChapterRead } from 'src/models/Chapter';
import { useChapterStore } from 'src/stores/chapterStore';
import { useGroupStore } from 'src/stores/groupStore';
import { IGroupRead } from 'src/models/Group';

const props = defineProps<{
  groupId: string
}>();

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

const group = computed<IGroupRead | undefined>(() => {
  return useGroupStore().findGroup(props.groupId);
})

const groupChapters = computed<IChapterRead[]>(() => {
  return chapters.value.filter(({ id }) => group.value && group.value.chapterIds.includes(id) ? true : false);
})
</script>
