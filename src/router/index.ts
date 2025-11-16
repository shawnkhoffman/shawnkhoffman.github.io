import { createRouter, createWebHistory } from 'vue-router';
import { defineAsyncComponent } from 'vue';

const routes = [
  {
    path: '/',
    name: 'Index',
    component: defineAsyncComponent(() => import('@/views/Index.vue')),
  },
  {
    path: '/about-me',
    name: 'About',
    component: defineAsyncComponent(() => import('@/views/About/About.vue')),
  },
  {
    path: '/about-this-site',
    name: 'AboutThisSite',
    component: defineAsyncComponent(() => import('@/views/AboutThisSite/AboutThisSite.vue')),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: defineAsyncComponent(() => import('@/views/NotFound.vue')),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  },
});

export default router;
