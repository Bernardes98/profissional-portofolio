import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'


import { updateSeo } from './utils/seo'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/projetos/:slug', name: 'project', component: () => import('./pages/ProjectPage.vue'), props: true },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('./pages/NotFoundPage.vue') },
  ],
  scrollBehavior(to, _from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, top: 86, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }
    return { top: 0 }
  },
})
router.afterEach((to) => updateSeo(to))
