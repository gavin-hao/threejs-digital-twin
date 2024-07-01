import { createWebHashHistory, createRouter } from 'vue-router';

import HomeView from '@/pages/Home.vue';

export const routes = [
  { name: 'home', path: '/', component: HomeView, meta: { title: '首页' } },
  {
    name: 'phoenix',
    path: '/Phoenix',
    meta: { title: '菲尼克斯电气数字孪生平台' },
    component: () => import('@/pages/Phoenix.vue'),
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
