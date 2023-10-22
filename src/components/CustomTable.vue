<template>
  <q-table
    :columns="props.columns"
    :rows="props.rows"
    :pagination="pagination"
    :rows-per-page-label="recordPerPage"
  >
    <template #body-cell-actions="props">
      <slot name="body-cell-actions" v-bind="props" ></slot>
    </template>
  </q-table>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { QTableColumn } from 'quasar';

import { pagination } from 'src/util/constant';
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  columns: QTableColumn[],
  rows: any[]
}>(), {
  columns: () => [],
  rows: () => []
});

const { t } = useI18n();

const recordPerPage = computed<string>(() => {
  return t('common.table.record_per_page')
})

</script>
