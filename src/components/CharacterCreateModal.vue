<template>
  <q-dialog v-model="isShow">
    <q-card style="min-width: 350px">
      <q-card-section>
        <CharacterForm
          @submit="submit"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';

import { useCharacterStore } from 'src/stores/characterStore';
import { ICharacterCreate } from 'src/models/Character';
import CharacterForm from 'src/components/CharacterForm.vue';

const $q = useQuasar();

const props = withDefaults(defineProps<{
  modelValue: boolean
}>(), {
  modelValue: false
});

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>();

const characterStore = useCharacterStore();

const isShow = ref<boolean>(props.modelValue);

watch(props, () => {
  if(props.modelValue !== isShow.value) {
    isShow.value = props.modelValue;
  }
});

watch(isShow, () => {
  emits('update:modelValue', isShow.value);
});

function submit(data: ICharacterCreate) {
  if(characterStore.aliasIsExisted(data.alias)) {
    $q.notify({
      type: 'negative',
      message: 'This alias was already existed!'
    });
  } else {
    characterStore.createCharacter({...data}).then(() => {
      $q.notify('Created');
    })
  }
}
</script>
