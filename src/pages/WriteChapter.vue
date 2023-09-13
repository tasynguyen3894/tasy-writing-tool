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
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

import WriteChapterForm, { Chapter } from 'src/components/WriteChapterForm.vue';
import { useChapterStore } from 'src/stores/chapterStore';
import { RouterNames } from 'src/router/routes';

const $q = useQuasar();
const router = useRouter();

const chapterStore = useChapterStore();

const chapterData = ref<Chapter>({
  content: '',
  title: '',
  description: '',
  status: '',
  tags: []
});

function submit(data: Chapter) {
  chapterStore.create({
    title: data.title,
    content: data.content,
    description: data.description,
    status: data.status,
    tags: data.tags
  }).then(() => {
    $q.notify('Created');
    router.push({
      name: RouterNames.ProjectChapterPage
    })
  })
}

</script>