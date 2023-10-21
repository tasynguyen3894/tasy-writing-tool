<template>
  <q-btn-dropdown>
    <template v-slot:label>
      <div class="row items-center no-wrap">
        <div class="text-center">
          <CountryFlag :country="locale === 'vn' ? 'vn' : 'gb'" />
        </div>
      </div>
    </template>
    <q-list>
      <q-item clickable v-close-popup @click="changeLocale('vn')">
        <q-item-section>
          <q-item-label>
            <CountryFlag country="vn" />
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-close-popup @click="changeLocale('en-US')">
        <q-item-section>
          <CountryFlag country="gb" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import CountryFlag from 'vue-country-flag-next';

const { locale } = useI18n();

function changeLocale(lang: 'en-US' | 'vn') {
  locale.value = lang;
}
</script>
