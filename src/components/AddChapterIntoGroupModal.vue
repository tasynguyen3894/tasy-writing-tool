<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';

import { useChapterStore } from 'src/stores/chapterStore';
import { useGroupStore } from 'src/stores/groupStore';
import { IGroupRead } from 'src/models/Group';

const props = withDefaults(defineProps<{
  modelValue: boolean,
  groupId: string
}>(), {
  modelValue: false
});

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>();

const $q = useQuasar();
const groupStore = useGroupStore();
const chapterStore = useChapterStore();
const { chapters } = storeToRefs(chapterStore);

const isShow = ref<boolean>(props.modelValue);
const chapterId = ref<string>();

const chapterOptions = computed<{ label: string, value: string }[]>(() => {
  if(!group.value) {
    return [];
  }

  const currentGroup = group.value;

  return chapters.value
    .filter(chaper => !currentGroup.chapterIds.includes(chaper.id))
    .map(chapter => ({
      label: chapter.title,
      value: chapter.id
    }));
});

const group = computed<IGroupRead | undefined>(() => {
  return groupStore.findGroup(props.groupId);
})

watch(isShow, () => {
  if(isShow.value !== props.modelValue) {
    emits('update:modelValue', isShow.value);
  }
});

watch(() => props.modelValue, () => {
  if(isShow.value !== props.modelValue) {
    isShow.value = props.modelValue;
  }
});

function addChapter() {
  if(chapterId.value) {
    groupStore.addChapter(props.groupId, chapterId.value)
      .then(() => {
        $q.notify('Added!');
        isShow.value = false;
      })
  }
}
</script>

<template>
  <q-dialog v-model="isShow">
    <q-card style="min-width: 750px">
      <q-card-section>
        <div class="text-h6">Add chapter</div>
      </q-card-section>
      <q-card-section>
        <div class="chapter-content">
          <q-select
            label="Chapters"
            v-model="chapterId"
            :options="chapterOptions"
            map-options
            option-label="label"
            option-value="value"
            emit-value
          />
        </div>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn flat label="Add" @click="addChapter()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
