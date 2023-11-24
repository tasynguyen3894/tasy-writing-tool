<template>
  <q-dialog v-model="isShow" persistent>
    <q-card style="min-width: 750px">
      <q-card-section>
        <div class="text-h6">{{ t('chapter.export.title') }}</div>
      </q-card-section>
      <q-card-section>

      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat :label="t('common.form.cancel')" v-close-popup />
        <q-btn flat :label="t('chapter.export.export')" @click="exportChapter()" :loading="isExporting" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import { useChapterStore } from 'src/stores/chapterStore';

const props = withDefaults(defineProps<{
  modelValue: boolean,
  groupId?: string
}>(), {
  modelValue: false
});

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>();

const { t } = useI18n();
const $q = useQuasar();

const chapterStore = useChapterStore();

const isShow = ref<boolean>(props.modelValue);
const isExporting = ref<boolean>(false);


watch(() => props.modelValue, () => {
  isShow.value = props.modelValue;
});



watch(isShow, () => {
  emits('update:modelValue', isShow.value);
});


function openExportDialog(): Promise<string> {
  return new Promise((resolve, reject) => {
    window.Native.exportGroup().then((data: any) => {
      console.log(data)
      if(data.filePaths && data.filePaths.length > 0) {
        resolve(data.filePaths[0]);
      }
    }).catch(error => {
      reject(error);
    })
  });
}

function exportChapter() {
  if(props.groupId) {
    const id = props.groupId;
    openExportDialog().then(url => {
      isExporting.value = true;
      console.log(url);
      // chapterStore.exportChapter(id, url).then(result => {
      //   isShow.value = false;
      //   $q.notify(t('chapter.export.exported'));
      // }).finally(() => {
      //   isExporting.value = false;
      // })
    })
  }
}
</script>
<style lang="scss" scoped>
.chapter-content {
  &__preview {
    max-height: 700px;
    overflow-y: scroll;
    overflow: auto;
    border: 1px solid #ccc;
    padding: 5px;
  }
}
</style>
