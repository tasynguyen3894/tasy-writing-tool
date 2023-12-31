<template>
  <q-dialog v-model="isShow" persistent>
    <q-card style="min-width: 750px">
      <q-card-section>
        <div class="text-h6">{{ t('chapter.export.title') }}</div>
      </q-card-section>
      <q-card-section>
        <div class="chapter-content">
          <div>{{ t('chapter.export.content') }}:</div>
          <div class="chapter-content__preview">
            <div v-html="content"></div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat :label="t('common.form.cancel')" v-close-popup />
        <q-btn flat :label="t('chapter.export.export')" @click="exportChapter()" :loading="isExporting" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import { useCharacterStore } from 'src/stores/characterStore';
import { useObjectStore } from 'src/stores/objectStore';
import { useChapterStore } from 'src/stores/chapterStore';
import { formatChapterContent } from 'src/util/editor';

const props = withDefaults(defineProps<{
  modelValue: boolean,
  chapterId?: string
}>(), {
  modelValue: false
});

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>();

const { t } = useI18n();
const $q = useQuasar();

const { characters } = storeToRefs(useCharacterStore());
const { objects } = storeToRefs(useObjectStore());
const chapterStore = useChapterStore();

const isShow = ref<boolean>(props.modelValue);
const content = ref<string>('');
const isExporting = ref<boolean>(false);

onMounted(() => {
  updateContent();
});

watch(() => props.modelValue, () => {
  isShow.value = props.modelValue;
});

watch(() => props.chapterId, () => {
  updateContent();
});

watch(isShow, () => {
  emits('update:modelValue', isShow.value);
});

function updateContent() {
  if(props.chapterId) {
    const chapter = chapterStore.findChapter(props.chapterId);
    if(chapter) {
      content.value = formatChapterContent(characters.value, objects.value, chapter.content);
    }
  }
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

function exportChapter() {
  if(props.chapterId) {
    const id = props.chapterId;
    openExportDialog().then(url => {
      isExporting.value = true;
      chapterStore.exportChapter(id, url).then(result => {
        isShow.value = false;
        $q.notify(t('chapter.export.exported'));
      }).finally(() => {
        isExporting.value = false;
      })
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
