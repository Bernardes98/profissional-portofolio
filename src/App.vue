<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { Github, Linkedin, Menu, X, ArrowUpRight } from 'lucide-vue-next'
import { gsap, prefersReduced } from './utils/motion'
import { projects } from './data/projects'

const menuOpen = ref(false)
const route = useRoute()
const year = new Date().getFullYear()
const curtainKicker = ref('')
const curtainTitle = ref('')

function closeMenu() { menuOpen.value = false }

/* ---------- Cursor de mira que segue o mouse (só em dispositivos com mouse) ---------- */
const cursor = ref<HTMLElement | null>(null)
let disposeCursor: (() => void) | undefined
onMounted(() => {
  const el = cursor.value
  if (!el || prefersReduced() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  const x = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' })
  const y = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' })
  const move = (e: PointerEvent) => {
    x(e.clientX); y(e.clientY)
    el.classList.add('is-on')
    el.classList.toggle('is-hover', !!(e.target as Element | null)?.closest?.('a, button'))
  }
  const leave = () => el.classList.remove('is-on')
  window.addEventListener('pointermove', move, { passive: true })
  document.documentElement.addEventListener('pointerleave', leave)
  disposeCursor = () => {
    window.removeEventListener('pointermove', move)
    document.documentElement.removeEventListener('pointerleave', leave)
  }
})
onUnmounted(() => disposeCursor?.())
watch(() => route.path, closeMenu)

/* ---------- Transição entre páginas: cortina em faixas com o título da próxima cena ---------- */
function describeDestination() {
  const project = projects.find(p => route.path === `/projetos/${p.slug}`)
  if (project) return { kicker: `CARREGANDO // PROJ_${project.number}`, title: project.name }
  if (route.path === '/') return { kicker: 'CARREGANDO // BASE', title: 'Início' }
  return { kicker: 'SINAL PERDIDO // 404', title: 'Fora do mapa' }
}

function onLeave(el: Element, done: () => void) {
  if (prefersReduced()) { window.dispatchEvent(new Event('cx:covered')); done(); return }
  const next = describeDestination()
  curtainKicker.value = next.kicker
  curtainTitle.value = next.title
  gsap.timeline({ onComplete: () => { window.dispatchEvent(new Event('cx:covered')); done() } })
    .set('.cx-curtain', { visibility: 'visible' })
    .fromTo('.cx-curtain-bar', { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 0.75, ease: 'power4.inOut', stagger: 0.05 })
    .to(el, { opacity: 0.35, duration: 0.6, ease: 'power2.in' }, 0)
    .fromTo('.cx-curtain-text .cx-mask-line > *', { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: 'expo.out', stagger: 0.07 }, 0.5)
    .fromTo('.cx-curtain-line', { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'expo.out' }, 0.55)
}

function onEnter(el: Element, done: () => void) {
  const finish = () => {
    gsap.set('.cx-curtain', { visibility: 'hidden' })
    document.querySelector<HTMLElement>('main')?.focus({ preventScroll: true })
    done()
  }
  if (prefersReduced()) { finish(); return }
  gsap.timeline({ delay: 0.2, onComplete: finish })
    .to('.cx-curtain-text .cx-mask-line > *', { yPercent: -110, duration: 0.45, ease: 'power3.in', stagger: 0.05 })
    .to('.cx-curtain-line', { scaleX: 0, transformOrigin: '100% 50%', duration: 0.45, ease: 'power3.in' }, 0)
    .to('.cx-curtain-bar', { scaleY: 0, transformOrigin: '50% 0%', duration: 0.85, ease: 'power4.inOut', stagger: 0.05 }, 0.25)
    .fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power1.out' }, 0.35)
}
</script>

<template>
  <div class="site-shell">
    <div class="reading-progress" aria-hidden="true"></div>
    <header class="site-header"><div class="container nav-inner">
      <RouterLink to="/" class="logo" @click="closeMenu" aria-label="Felipe Bernardes, início">F<span>.</span>B<span class="logo-slash">/</span></RouterLink>
      <nav :class="['nav-links',{opened:menuOpen}]" aria-label="Navegação principal">
        <RouterLink to="/#projetos" @click="closeMenu">Projetos</RouterLink>
        <RouterLink to="/#sobre" @click="closeMenu">Sobre mim</RouterLink>
        <RouterLink to="/#experiencia" @click="closeMenu">Expertise</RouterLink>
        <RouterLink to="/#contato" @click="closeMenu">Contato <ArrowUpRight :size="14"/></RouterLink>
      </nav>
      <div class="header-right"><span class="availability"><span class="green-pulse"></span>FULL STACK DEVELOPER</span><button class="menu-toggle" type="button" @click="menuOpen=!menuOpen" :aria-label="menuOpen?'Fechar menu':'Abrir menu'" :aria-expanded="menuOpen"><X v-if="menuOpen" :size="23"/><Menu v-else :size="23"/></button></div>
    </div></header>

    <div id="smooth-wrapper">
      <div id="smooth-content">
        <RouterView v-slot="{ Component, route: current }">
          <Transition :css="false" mode="out-in" @leave="onLeave" @enter="onEnter">
            <div :key="current.path" class="route-canvas"><component :is="Component" /></div>
          </Transition>
        </RouterView>
        <footer class="footer"><div class="container footer-inner"><RouterLink to="/" class="logo">F<span>.</span>B<span class="logo-slash">/</span></RouterLink><span>© {{ year }} FELIPE BERNARDES. FEITO COM INTENÇÃO.</span><div class="footer-social"><a href="https://github.com/bernardes98" target="_blank" rel="noopener noreferrer" aria-label="GitHub de Felipe"><Github :size="19"/></a><a href="https://www.linkedin.com/in/bernardesfelipe/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de Felipe"><Linkedin :size="19"/></a><a href="https://wa.me/5551994291091" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp de Felipe">WA</a><RouterLink to="/#inicio" aria-label="Voltar ao início"><ArrowUpRight :size="19"/></RouterLink></div></div></footer>
      </div>
    </div>

    <!-- Película: grão e vinheta sobre todo o site -->
    <div class="film-grain" aria-hidden="true"></div>
    <div class="film-vignette" aria-hidden="true"></div>

    <!-- Cursor de mira -->
    <div ref="cursor" class="cx-cursor" aria-hidden="true"><span class="cx-cursor-ring"></span></div>

    <!-- Cortina da transição entre páginas -->
    <div class="cx-curtain" aria-hidden="true">
      <i v-for="n in 6" :key="n" class="cx-curtain-bar"></i>
      <div class="cx-curtain-text"><span class="cx-mask-line"><span>{{ curtainKicker }}</span></span><span class="cx-mask-line"><strong>{{ curtainTitle }}</strong></span></div>
      <span class="cx-curtain-line"></span>
    </div>
  </div>
</template>
