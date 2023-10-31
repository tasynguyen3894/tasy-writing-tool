<template>
  <q-dialog
    v-model="isShow"
  >
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">{{ t('chapter.editor.add_variable') }}</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <DraggableComponent
          v-model="sortableItems"
          @start="drag=true" 
          @end="drag=false" 
          item-key="id"
        >
          <template #item="{element}">
            <div class="sortable__item">
              {{ element.title }}
            </div>
          </template>
        </DraggableComponent>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat :label="t('common.form.cancel')" v-close-popup />
        <q-btn flat :label="t('common.form.add')" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import DraggableComponent from 'vuedraggable';

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
  (e: 'update:modelValue', value: boolean): void
}>();

const { t } = useI18n();

const drag = ref<boolean>(false);
const isShow = ref<boolean>(props.modelValue);
const sortableItems = ref<SortItem[]>(props.sortItems);

watch(() => props.modelValue, () => {
  if(props.modelValue !== isShow.value) {
    isShow.value = props.modelValue;
  }
});

watch(isShow, () => {
  emits('update:modelValue', isShow.value);
});
</script>
<style lang="scss" scoped>
.sortable {
  &__item {
    cursor: grab;
  }
}
</style>
