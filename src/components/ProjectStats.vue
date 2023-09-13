<template>
  <div class="row">
    <div class="col-3 stat">
      <div>Character:</div>
      <div>{{ characterStore.characters.length }}</div>
    </div>
    <div class="col-3 stat">
      <div>Chapter:</div>
      <div>{{ chapterStore.chapters.length }}</div>
    </div>
    <div class="col-3 stat">
      <div>Object:</div>
      <div>{{ objectrStore.objects.length }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useCharacterStore } from 'src/stores/characterStore';
import { useChapterStore } from 'src/stores/chapterStore';
import { useObjectrStore } from 'src/stores/objectStore';

const characterStore = useCharacterStore();
const chapterStore = useChapterStore();
const objectrStore = useObjectrStore();
</script>
