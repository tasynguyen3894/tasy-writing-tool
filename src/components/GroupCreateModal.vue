<template>
  <q-dialog v-model="isShow">
    <q-card style="min-width: 350px">
      <q-card-section>
        <GroupForm
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

import { useGroupStore } from 'src/stores/groupStore';
import { IGroupCreate } from 'src/models/Group';
import GroupForm from 'src/components/GroupForm.vue';

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

const groupStore = useGroupStore();

const isShow = ref<boolean>(props.modelValue);

watch(props, () => {
  if(props.modelValue !== isShow.value) {
    isShow.value = props.modelValue;
  }
});

watch(isShow, () => {
  emits('update:modelValue', isShow.value);
});

function submit(data: IGroupCreate) {
  groupStore.create({...data}).then(() => {
    $q.notify(t('common.form.created'));
    isShow.value = false;
  });
}
</script>
