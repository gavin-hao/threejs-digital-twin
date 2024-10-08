import { createWebHashHistory, createRouter } from 'vue-router';

import HomeView from '@/pages/Home.vue';

export const routes = [
  { name: 'home', path: '/', component: HomeView, meta: { title: '首页' } },
  // {
  //   name: 'phoenix',
  //   path: '/Phoenix',
  //   meta: { title: '菲尼克斯电气数字孪生平台' },
  //   component: () => import('@/pages/phoenix/Index.vue'),
  // },
  {
    name: 'phoenix',
    path: '/phoenix',
    meta: { title: '菲尼克斯电气数字孪生平台' },
    component: () => import('@/pages/phoenix2/Index.vue'),
  },
  // {
  //   name: 'steelmill',
  //   path: '/steelmill',
  //   meta: { title: '钢铁厂数字孪生平台' },
  //   component: () => import('@/pages/steelmill/Index.vue'),
  // },
  {
    name: 'steelmill',
    path: '/steelmill',
    meta: { title: '钢铁厂数字孪生平台' },
    component: () => import('@/pages/steelmill2/Index.vue'),
  },
  // {
  //   name: 'warehouse',
  //   path: '/warehouse',
  //   meta: { title: 'X仓库数字孪生' },
  //   component: () => import('@/pages/warehouse/Index.vue'),
  // },
  {
    name: 'test',
    path: '/test',
    meta: { title: 'test' },
    props: { visible: true, modelName: 'Zhongzhaji' },
    component: () => import('@/pages/steelmill2/Scene2.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  },
});

export default router;
