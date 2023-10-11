<template>
  <div class="q-pa-md" v-if="group">
    <div class="row">
      <div class="col-4">
        <GroupForm
          :data="group"
          has-remove
          @remove="remove()"
          @submit="submit"
        />
      </div>
      <div class="col-1"></div>
      <div class="col-6">
        <GroupChapter
          :group-id="group.id"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

import { useGroupStore } from 'src/stores/groupStore';
import GroupForm from 'src/components/GroupForm.vue';
import { RouterNames } from 'src/router/routes';
import { IGroupCreate, IGroupRead } from 'src/models/Group';
import GroupChapter from 'src/components/GroupChapter.vue';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();

const groupStore = useGroupStore();

const group = computed<IGroupRead | undefined>(() => {
  if(route.params.id) {
    console.log(route.params.id)
    return groupStore.findGroup(route.params.id as string);
  }
  return undefined;
});

function remove() {
  if(group.value) {
    groupStore.remove(group.value.id).then(() => {
      $q.notify('Deleted');
      router.push(({ name: RouterNames.ProjectCharacterPage }));
    });
  }
}

function submit(data: IGroupCreate) {
  if(group.value) {
    groupStore.update(group.value.id, {...data}).then(() => {
      $q.notify('Updated');
    })
  }
}
</script>
