import { RouteRecordRaw } from 'vue-router';

import { useProjectStore } from 'src/stores/projectStore';

export enum RouterNames {
  HomePage = 'HomePage',
  ProjectOverviewPage = 'ProjectOverviewPage',
  ProjectCharacterPage = 'ProjectCharacterPage',
  ProjectCharacterDetailPage = 'ProjectCharacterDetailPage',
  ProjectObjectPage = 'ProjectObjectPage',
  ProjectChapterPage = 'ProjectChapterPage',
  ProjectWriteChapterPage = 'ProjectWriteChapterPage',
  ProjectChapterDetailPage = 'ProjectChapterDetailPage',
  ProjectGroupPage = 'ProjectGroupPage',
  ProjectObjectDetailPage = 'ProjectObjectDetailPage',
  ProjectGroupDetailPage = 'ProjectGroupDetailPage',
  ProjectSettingPage = 'ProjectSettingPage',
  NonProjectSettingPage = 'NonProjectSettingPage'
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (_, __, next) => {
      if(useProjectStore().projectPath !== '') {
        next({ name: RouterNames.ProjectOverviewPage })
      } else {
        next();
      }
    },
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        name: RouterNames.HomePage
      },
      {
        path: '/settings',
        component: () => import('pages/SettingPage.vue'),
        name: RouterNames.ProjectSettingPage
      },
    ],
  },
  {
    path: '/project',
    component: () => import('layouts/ProjectLayout.vue'),
    beforeEnter: (_, __, next) => {
      if(useProjectStore().projectPath === '') {
        next({ name: RouterNames.HomePage })
      } else {
        next();
      }
    },
    children: [
      {
        path: '',
        component: () => import('pages/ProjectOvervierPage.vue'),
        name: RouterNames.ProjectOverviewPage
      },
      {
        path: '/characters',
        component: () => import('pages/CharacterList.vue'),
        name: RouterNames.ProjectCharacterPage
      },
      {
        path: '/characters/:id',
        component: () => import('pages/CharacterDetail.vue'),
        name: RouterNames.ProjectCharacterDetailPage
      },
      {
        path: '/objects',
        component: () => import('pages/ObjectList.vue'),
        name: RouterNames.ProjectObjectPage
      },
      {
        path: '/chapters',
        component: () => import('pages/ChapterList.vue'),
        name: RouterNames.ProjectChapterPage
      },
      {
        path: '/chapters/write',
        component: () => import('pages/WriteChapter.vue'),
        name: RouterNames.ProjectWriteChapterPage
      },
      {
        path: '/chapters/:id',
        component: () => import('pages/ChapterDetail.vue'),
        name: RouterNames.ProjectChapterDetailPage
      },
      {
        path: '/object/:id',
        component: () => import('pages/ObjectDetail.vue'),
        name: RouterNames.ProjectObjectDetailPage
      },
      {
        path: '/groups',
        component: () => import('pages/GroupList.vue'),
        name: RouterNames.ProjectGroupPage
      },
      {
        path: '/groups/:id',
        component: () => import('pages/GroupDetail.vue'),
        name: RouterNames.ProjectGroupDetailPage
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
