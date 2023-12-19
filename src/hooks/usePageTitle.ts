import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

import { RouterNames } from 'src/router/routes';

const RouteNameInI18n: { [key: string]: string } = {
  [RouterNames.ProjectOverviewPage]: 'overview',
  [RouterNames.ProjectCharacterPage]: 'character',
  [RouterNames.ProjectCharacterDetailPage]: 'character_detail',
  [RouterNames.ProjectObjectPage]: 'object',
  [RouterNames.ProjectChapterPage]: 'chapter',
  [RouterNames.ProjectWriteChapterPage]: 'write_chapter',
  [RouterNames.ProjectChapterDetailPage]: 'chapter_detail',
  [RouterNames.ProjectGroupPage]: 'group',
  [RouterNames.ProjectObjectDetailPage]: 'object_detail',
  [RouterNames.ProjectGroupDetailPage]: 'group_detail',
  [RouterNames.ProjectSettingPage]: 'setting'
}

export function usePageTitle() {
  const route = useRoute();
  const { t } = useI18n();
  const title = ref<string>(route.name?.toString() || '');

  const pageTitle = computed<string>(() => {
    if(RouteNameInI18n[title.value]) {
      return t('common.' + RouteNameInI18n[title.value], RouteNameInI18n[title.value]);
    }
    return '';
  });

  watch(() => route.name, () => {
    title.value = route.name ? route.name.toString() : '';
  });

  return {
    pageTitle
  }
}
