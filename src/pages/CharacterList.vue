<template>
  <q-page>
    <div>
      <q-btn icon="add" flat @click="isShowCreateModal = true" />
    </div>
    <CustomTable
      :rows="characters"
      :columns="columns"
    >
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="edit" flat size="0.7em" @click="edit(props.row.id)" />
        </q-td>
      </template>
    </CustomTable>
  </q-page>
  <CharacterCreateModal v-model="isShowCreateModal" />
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { QTableColumn } from 'quasar';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import { useCharacterStore } from 'src/stores/characterStore';
import { RouterNames } from 'src/router/routes';
import CharacterCreateModal from 'src/components/CharacterCreateModal.vue';
import CustomTable from 'src/components/CustomTable.vue';

const { t } = useI18n();
const router = useRouter();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);

const columns = computed<QTableColumn[]>(() => [
  {
    field: 'name',
    label: t('character.name'),
    name: 'name'
  },
  {
    field: 'alias',
    label: t('character.alias'),
    name: 'alias'
  },
  {
    field: 'description',
    label: t('character.description'),
    name: 'description'
  },
  {
    field: '',
    label: t('common.table.action'),
    name: 'actions'
  },
]);

const isShowCreateModal = ref<boolean>(false);

function edit(id: string) {
  router.push({
    name: RouterNames.ProjectCharacterDetailPage,
    params: {
      id
    }
  })
}
</script>
