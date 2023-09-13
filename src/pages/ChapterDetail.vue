<template>
  <q-page>
    <div class="row justify-center q-pt-md">
      <div class="col-10">
        <WriteChapterForm
          :data="chapterData"
          @submit="submit"
        />
      </div>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter, useRoute } from 'vue-router';

import WriteChapterForm, { Chapter } from 'src/components/WriteChapterForm.vue';
import { useChapterStore } from 'src/stores/chapterStore';
import { RouterNames } from 'src/router/routes';

const $q = useQuasar();
const router = useRouter();
const route = useRoute();

const chapterStore = useChapterStore();

const chapterData = computed<Chapter | undefined>(() => {
  if(route.params.id) {
    const chapter = chapterStore.findChapter(route.params.id as string);
    if(chapter) {
      return {
        id: chapter.id,
        content: chapter.content,
        title: chapter.title,
        description: chapter.description || '',
        status: chapter.status,
        tags: chapter.tags || []
      }
    }
  }
  return undefined;
});

function submit(data: Chapter) {
  if(route.params.id) {
    chapterStore.update(
      route.params.id as string,
      {
        title: data.title,
        content: data.content,
        description: data.description,
        status: data.status,
        tags: data.tags
      }
    ).then(() => {
      $q.notify('Updated');
      router.push({
        name: RouterNames.ProjectChapterPage
      })
    })
  }
}

</script>