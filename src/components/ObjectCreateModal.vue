<template>
  <q-dialog v-model="isShow">
    <q-card style="min-width: 350px">
      <q-card-section>
        <ObjectForm
          @submit="submit"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import { useObjectStore } from 'src/stores/objectStore';
import { IObjectCreate } from 'src/models/Object';
import ObjectForm from 'src/components/ObjectForm.vue';

const { t } = useI18n();
const $q = useQuasar();

const props = withDefaults(defineProps<{
  modelValue: boolean
}>(), {
  modelValue: false
});

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>();

const objectStore = useObjectStore();

const isShow = ref<boolean>(props.modelValue);

watch(props, () => {
  if(props.modelValue !== isShow.value) {
    isShow.value = props.modelValue;
  }
});

watch(isShow, () => {
  emits('update:modelValue', isShow.value);
});

function submit(data: IObjectCreate) {
  if(objectStore.aliasIsExisted(data.alias)) {
    $q.notify({
      type: 'negative',
      message: 'This alias was already existed!'
    });
  } else {
    objectStore.createObject({...data}).then(() => {
      $q.notify(t('common.form.created'));
      isShow.value = false;
    });
  }
}
</script>
