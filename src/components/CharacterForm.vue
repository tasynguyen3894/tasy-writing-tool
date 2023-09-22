<template>
  <div>
    <div>Information</div>
    <q-input
      filled
      v-model="character.name"
      label="Character name"
      lazy-rules
      :rules="[ val => val && val.length > 0 || 'Please type something']"
    />
    <q-input
      filled
      v-model="character.alias"
      label="Character alias"
      lazy-rules
      :rules="[ val => val && val.length > 0 || 'Please type something']"
    />
    <q-input
      filled
      v-model="character.hint"
      label="Character hint"
      lazy-rules
      bottom-slots
    />
    <q-input
      filled
      v-model="character.description"
      label="Character description"
      type="textarea"
      lazy-rules
    />
    <div class="q-pt-md" align="right">
      <q-btn
        v-if="props.hasRemove"
        label="Remove"
        flat
        @click="remove()"
      />
      <q-btn
        label="Submit"
        color="primary"
        :disable="character.alias.length === 0 || character.name.length === 0"
        @click="submit()"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';

import { ICharacterCreate } from 'src/models/Character';

const $q = useQuasar();

const props = withDefaults(defineProps<{
  data?: ICharacterCreate,
  hasRemove?: boolean
}>(), {
  hasRemove: false
});

const emits = defineEmits<{
  (e: 'submit', value: ICharacterCreate): void,
  (e: 'remove'): void
}>();

const character = ref<ICharacterCreate>(props.data || {
  name: '',
  alias: '',
  hint: '',
  description: ''
});

watch(props, () => {
  if(props.data) {
    character.value = props.data;
  }
});

function submit() {
  emits('submit', {
    name: character.value.name,
    alias: character.value.alias,
    hint: character.value.hint,
    description: character.value.description,
  });
}

function remove() {
  $q.dialog({
    title: 'Confirm',
    message: 'Would you want to delete this meta?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    handleRemove()
  });
}

function handleRemove() {
  emits('remove');
}
</script>

