<template>
  <div class="q-pa-md" v-if="character">
    <div class="row">
      <div class="col-4">
        <CharacterForm
          :data="character"
          has-remove
          @remove="remove()"
          @submit="submit"
        />
      </div>
      <div class="col-1"></div>
      <div class="col-6">
        <CharacterMeta
          v-model="character.metas"
          :character-id="character.id"
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

import { useCharacterStore } from 'src/stores/characterStore';
import { ICharacterCreate, ICharacterRead } from 'src/models/Character';
import CharacterMeta from 'src/components/CharacterMeta.vue';
import CharacterForm from 'src/components/CharacterForm.vue';
import { RouterNames } from 'src/router/routes';

const { t } = useI18n();
const $q = useQuasar();
const route = useRoute();
const router = useRouter();

const characterStore = useCharacterStore();

const character = computed<ICharacterRead | undefined>(() => {
  if(route.params.id) {
    return characterStore.findCharacter(route.params.id as string);
  }
  return undefined;
});

function remove() {
  if(character.value) {
    characterStore.removeCharacter(character.value.id).then(() => {
      $q.notify(t('common.form.deleted'));
      router.push(({ name: RouterNames.ProjectCharacterPage }));
    });
  }
}

function submit(data: ICharacterCreate) {
  if(character.value) {
    if(characterStore.aliasIsExisted(data.alias, character.value.id)) {
      $q.notify({
        type: 'negative',
        message: 'This alias was already existed!'
      });
    } else {
      characterStore.updateCharacter(character.value.id, {...data}).then(() => {
        $q.notify(t('common.form.updated'));
      })
    }
  }
}
</script>
