import { RouteRecordRaw } from 'vue-router';

export enum RouterNames {
  HomePage = 'HomePage',
  ProjectOverviewPage = 'ProjectOverviewPage',
  ProjectCharacterPage = 'ProjectCharacterPage',
  ProjectCharacterDetailPage = 'ProjectCharacterDetailPage',
  ProjectObjectPage = 'ProjectObjectPage',
  ProjectChapterPage = 'ProjectChapterPage',
  ProjectWriteChapterPage = 'ProjectWriteChapterPage',
  ProjectChapterDetailPage = 'ProjectChapterDetailPage',
  ProjectGroupPage = 'ProjectGroupPage'
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        name: RouterNames.HomePage
      }
    ],
  },
  {
    path: '/project',
    component: () => import('layouts/ProjectLayout.vue'),
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
        path: '/groups',
        component: () => import('pages/GroupList.vue'),
        name: RouterNames.ProjectGroupPage
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
