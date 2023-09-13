<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-4">
        <CharacterForm
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';

import { useCharacterStore } from 'src/stores/characterStore';
import CharacterMeta from 'src/components/CharacterMeta.vue';
import CharacterForm from 'src/components/CharacterForm.vue';

const route = useRoute();

const characterStore = useCharacterStore();
</script>
