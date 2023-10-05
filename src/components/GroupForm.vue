<template>
  <div>
    <div>Group</div>
    <q-input
      filled
      v-model="group.title"
      label="Group name"
      lazy-rules
      :rules="[ val => val && val.length > 0 || 'Please type something']"
    />
    <q-input
      filled
      v-model="group.description"
      label="Group description"
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
        :disable="group.title.length === 0"
        @click="submit()"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';

import { IGroupCreate } from 'src/models/Group';

const $q = useQuasar();

const props = withDefaults(defineProps<{
  data?: IGroupCreate,
  hasRemove?: boolean
}>(), {
  hasRemove: false
});

const emits = defineEmits<{
  (e: 'submit', value: IGroupCreate): void,
  (e: 'remove'): void
}>();

const group = ref<IGroupCreate>(props.data || {
  title: '',
  description: ''
});

watch(props, () => {
  if(props.data) {
    group.value = props.data;
  }
});

function submit() {
  emits('submit', {
    title: group.value.title,
    description: group.value.description,
  });
}

function remove() {
  $q.dialog({
    title: 'Confirm',
    message: 'Would you want to delete this group?',
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

