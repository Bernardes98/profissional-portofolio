import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import { updateSeo } from './utils/seo'
import { scrollToTarget, whenCovered } from './utils/motion'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/projetos/:slug', name: 'project', component: () => import('./pages/ProjectPage.vue'), props: true },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('./pages/NotFoundPage.vue') },
  ],
  async scrollBehavior(to, from, saved) {
    // Mesma página (links do menu como "/#projetos"): rola suavemente, sem trocar de cena.
    if (from.matched.length && to.path === from.path) {
      scrollToTarget(to.hash || 0)
      return false
    }
    // Primeiro carregamento: a própria página cuida de âncoras depois de montar as animações.
    if (!from.matched.length) return saved ?? { top: 0 }
    // Troca de página: espera a cortina cobrir a tela antes de reposicionar o scroll.
    await whenCovered()
    if (saved) return saved
    // Com âncora (ex.: voltar para "/#projetos"), a página de destino posiciona depois de montar as cenas.
    return to.hash ? false : { top: 0 }
  },
})
router.afterEach((to) => updateSeo(to))
