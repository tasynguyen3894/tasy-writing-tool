<template>
  <q-dialog
    v-model="isShow"
  >
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">{{ t('group.sort') }}</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <VueDraggable ref="el" v-model="sortableItems">
          <div class="sortable__item" v-for="item in sortableItems" :key="item.id">
            {{ item.title }}
          </div>
        </VueDraggable>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat :label="t('common.form.cancel')" v-close-popup />
        <q-btn flat :label="t('group.sort')" @click="submit()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { VueDraggable } from 'vue-draggable-plus'

export interface SortItem {
  id: string,
  title: string,
  order: number
}

const props = withDefaults(defineProps<{
  modelValue: boolean,
  sortItems: SortItem[]
}>(), {
  modelValue: false,
  sortItems: () => []
});

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void,
  (e: 'submit', value: SortItem[]): void
}>();

const { t } = useI18n();

const isShow = ref<boolean>(props.modelValue);
const sortableItems = ref<SortItem[]>(props.sortItems);

watch(() => props.modelValue, () => {
  if(props.modelValue !== isShow.value) {
    isShow.value = props.modelValue;
  }
});

watch(() => props.sortItems, (() => {
  sortableItems.value = props.sortItems;
}))

watch(isShow, () => {
  emits('update:modelValue', isShow.value);
});

function submit() {
  emits('submit', sortableItems.value);
}
</script>
<style lang="scss" scoped>
.sortable {
  &__item {
    cursor: grab;
    background: #c4c1c1;
    padding: 5px;
    margin-bottom: 10px;
    border-radius: 5px;
  }
}
</style>
