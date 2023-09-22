<template>
  <div>
    <div>Information</div>
    <q-input
      filled
      v-model="object.name"
      label="Object name"
      lazy-rules
      :rules="[ val => val && val.length > 0 || 'Please type something']"
    />
    <q-input
      filled
      v-model="object.type"
      label="Object type"
      lazy-rules
      :rules="[ val => val && val.length > 0 || 'Please type something']"
    />
    <q-input
      filled
      v-model="object.alias"
      label="Object alias"
      lazy-rules
      :rules="[ val => val && val.length > 0 || 'Please type something']"
    />
    <q-input
      filled
      v-model="object.hint"
      label="Object hint"
      lazy-rules
      bottom-slots
    />
    <q-input
      filled
      v-model="object.description"
      label="Object description"
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
        :disable="object.alias.length === 0 || object.name.length === 0"
        @click="submit()"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';

import { IObjectCreate } from 'src/models/Object';

const $q = useQuasar();

const props = withDefaults(defineProps<{
  data?: IObjectCreate,
  hasRemove?: boolean
}>(), {
  hasRemove: false
});

const emits = defineEmits<{
  (e: 'submit', value: IObjectCreate): void,
  (e: 'remove'): void
}>();

const object = ref<IObjectCreate>(props.data || {
  name: '',
  alias: '',
  hint: '',
  description: '',
  type: ''
});

watch(props, () => {
  if(props.data) {
    object.value = props.data;
  }
});

function submit() {
  emits('submit', {
    name: object.value.name,
    alias: object.value.alias,
    hint: object.value.hint,
    description: object.value.description,
    type: object.value.type
  });
}

function remove() {
  $q.dialog({
    title: 'Confirm',
    message: 'Would you want to delete this object?',
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

