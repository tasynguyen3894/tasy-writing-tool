<template>
  <div class="q-pa-md" v-if="object">
    <div class="row">
      <div class="col-4">
        <ObjectForm
          :data="object"
          has-remove
          @remove="remove()"
          @submit="submit"
        />
      </div>
      <div class="col-1"></div>
      <div class="col-6">
        <ObjectMeta
          v-model="object.metas"
          :object-id="object.id"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import { useObjectStore } from 'src/stores/objectStore';
import { IOBjectUpdate, IObjectRead } from 'src/models/Object';
import ObjectMeta from 'src/components/ObjectMeta.vue';
import ObjectForm from 'src/components/ObjectForm.vue';
import { RouterNames } from 'src/router/routes';

const { t } = useI18n();
const $q = useQuasar();
const route = useRoute();
const router = useRouter();

const objectStore = useObjectStore();

const object = computed<IObjectRead | undefined>(() => {
  if(route.params.id) {
    return objectStore.findObject(route.params.id as string);
  }
  return undefined;
});

function remove() {
  if(object.value) {
    objectStore.removeObject(object.value.id).then(() => {
      $q.notify(t('common.form.deleted'));
      router.push(({ name: RouterNames.ProjectObjectPage }));
    });
  }
}

function submit(data: IOBjectUpdate) {
  if(object.value) {
    if(data.alias && objectStore.aliasIsExisted(data.alias, object.value.id)) {
      $q.notify({
        type: 'negative',
        message: 'This alias was already existed!'
      });
    } else {
      objectStore.updateObject(object.value.id, {...data}).then(() => {
        $q.notify(t('common.form.updated'));
      })
    }
  }
}
</script>
