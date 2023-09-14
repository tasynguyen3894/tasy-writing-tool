<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">{{ chapterData.id ? 'Update' : 'Create' }} chapter</div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <q-input v-model="chapterData.title" label="Title" bottomSlots />
      <q-input v-model="chapterData.description" type="textarea" label="Description" bottomSlots />
      <q-select
        :options="statusOptions"
        v-model="chapterData.status"
        map-options
        emit-value
        label="Status"
        bottomSlots
      />
      <ChapterEditor
        v-model="chapterData.content"
        label="Content"
        :characters="editorCharacter"
        :toolbars="[
          ['bold', 'italic', 'underline', 'strikeThrough']
        ]"
      />
      <div>
        <q-input v-model="tagContent" @keyup.enter="addTag()" label="Tags" />
        <q-chip
          v-for="tag in chapterData.tags"
          :key="tag"
          removable
          @remove="removeTag(tag)"
        >
          {{ tag }}
        </q-chip>
      </div>
    </q-card-section>
    <q-card-actions align="right" class="text-primary">
      <q-btn v-if="props.data.id" @click="remove()" flat label="Remove" />
      <q-btn
        :label="chapterData.id ? 'Update' : 'Create'"
        color="primary"
        @click="submit()"
        :disable="chapterData.status.length === 0 || chapterData.title.length === 0 || chapterData.content.length === 0"
      />
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';

import ChapterEditor, { Character } from 'src/components/ChapterEditor.vue';
import { useCharacterStore } from 'src/stores/characterStore';
import { Status } from 'src/models/Chapter';

export interface Chapter {
  id?: string,
  title: string;
  description: string;
  content: string,
  status: string,
  tags: string[]
}

const $q = useQuasar();

const props = withDefaults(defineProps<{
  data?: Chapter
}>(), {
  data: () => ({
    title: '',
    description: '',
    content: '',
    status: '',
    tags: []
  })
});

const emits = defineEmits<{
  (e: 'submit', value: Chapter): void,
  (e: 'remove'): void,
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);

const statusOptions = [
  {
    label: 'Publish',
    value: Status.PUBLISH
  },
  {
    label: 'Draft',
    value: Status.DRAFT
  },
  {
    label: 'Hide',
    value: Status.HIDE
  },
];

const chapterData = ref<Chapter>(props.data);
const tagContent = ref<string>('');

const editorCharacter = computed<Character[]>(() => {
  return characters.value.map(character => {
    return {
      id: character.id, 
      alias: character.alias,
      name: character.name,
      metas: character.metas || []
    }
  });
});

function removeTag(tagShouldRemove: string) {
  chapterData.value.tags = chapterData.value.tags.filter(tag => tag != tagShouldRemove);
}

function addTag() {
  if(!chapterData.value.tags.includes(tagContent.value)) {
    chapterData.value.tags.push(tagContent.value);
  }
  tagContent.value = '';
}

function submit() {
  if(props.data.id) {
    $q.dialog({
      title: 'Confirm',
      message: 'Would you want to update this chapter?',
      cancel: true,
      persistent: true
    }).onOk(() => {
      emits('submit', chapterData.value);
    });
  } else {
    emits('submit', chapterData.value);
  }
  
};

function remove() {
  $q.dialog({
    title: 'Confirm',
    message: 'Would you want to delete this chapter?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    emits('remove');
  });
}

</script>

