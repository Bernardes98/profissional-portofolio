<script setup lang="ts">
import { createTextVNode, h, onMounted, onUnmounted, ref, type FunctionalComponent, type VNode } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ArrowDown, ArrowUpRight, Github, Linkedin, ArrowRight } from 'lucide-vue-next'
import { gsap, ScrollTrigger, enableSmooth, disableSmooth, getSmoother, motionState, prefersReduced, scramble, scrollToTarget, whenCovered } from '../utils/motion'

/* ---------- Texto dividido para as animações (palavras com máscara e letras soltas) ---------- */
const Words: FunctionalComponent<{ text: string }> = props =>
  props.text.split(' ').flatMap((word, i): VNode[] => {
    const node = h('span', { class: 'cx-word' }, [h('span', word)])
    return i ? [createTextVNode(' '), node] : [node]
  })
Words.props = ['text']
const Chars: FunctionalComponent<{ text: string }> = props =>
  [...props.text].map(char => h('span', { class: 'cx-char' }, char === ' ' ? ' ' : char))
Chars.props = ['text']

const route = useRoute()
const root = ref<HTMLElement | null>(null)

/* A abertura (contagem + obturador) só acontece quando o site é aberto direto na home. */
const reduced = prefersReduced()
const firstLoad = !motionState.booted
motionState.booted = true
let leaderSeen = false
try { leaderSeen = sessionStorage.getItem('cx-leader') === '1' } catch { /* armazenamento indisponível */ }
const showShutters = firstLoad && !reduced && !route.hash
const showLeader = showShutters && !leaderSeen
const leaderNum = ref('3')
const leaderEl = ref<HTMLElement | null>(null)
const shutterTop = ref<HTMLElement | null>(null)
const shutterBottom = ref<HTMLElement | null>(null)

const spotlight = [
  { num: '01', name: 'Gestor de Vendas', label: 'PLATAFORMA SAAS', description: 'Operações, vendas e dados em um único lugar.', image: '/projects/cinematic/gestor-dashboard.webp', detail: '/projects/cinematic/gestor-graficos.webp', className: 'gestor', slug: 'gestor-de-vendas', stack: 'Java · Spring Boot · Vue · PWA' },
  { num: '02', name: 'Ateliê Tati Retamozo', label: 'EXPERIÊNCIA E-COMMERCE', description: 'Uma vitrine digital construída para encantar e vender.', image: '/projects/cinematic/atelie-home.webp', detail: '/projects/cinematic/atelie-catalogo.webp', className: 'atelie', slug: 'atelie-tati-retamozo', stack: 'E-commerce · API REST · Pagamentos' },
  { num: '03', name: 'Perfumaria Armelin', label: 'BACKEND E ARQUITETURA', description: 'Estrutura de software para um comércio que evolui.', image: '', detail: '', className: 'armelin', slug: 'perfumaria-armelin', stack: 'Java · Spring Security · REST' }
]

const manifesto = 'Não escrevo apenas código. Construo produtos que resolvem problemas reais — da API ao último pixel, com engenharia sólida, visão de negócio e atenção obsessiva aos detalhes.'.split(' ')
const highlightWords = new Set(['produtos', 'reais', 'engenharia', 'sólida,', 'detalhes.'])

const capabilities = [
  { num: '01', title: 'Backend & APIs', text: 'Java, Spring Boot, sistemas distribuídos e integrações.' },
  { num: '02', title: 'Frontend & UX', text: 'Vue, TypeScript, interfaces responsivas e experiência.' },
  { num: '03', title: 'Cloud & DevOps', text: 'AWS, Docker, bancos de dados e publicação.' }
]
const marqueeA = ['JAVA', 'SPRING BOOT', 'VUE', 'TYPESCRIPT', 'REST APIs', 'PWA']
const marqueeB = ['AWS', 'DOCKER', 'POSTGRESQL', 'SEGURANÇA', 'PRODUTO', 'UX']

let ctx: gsap.Context | undefined
let mm: gsap.MatchMedia | undefined
const cleanups: Array<() => void> = []

function lockScroll(lock: boolean) {
  const smoother = getSmoother()
  if (smoother) smoother.paused(lock)
  else document.documentElement.style.overflow = lock ? 'hidden' : ''
}

/* ---------- Abertura: contagem de película → obturador → título ---------- */
function playIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
  let t = 0
  // Abertura fica fora do conteúdo com scroll suave (Teleport), então usa referências diretas.
  const leader = leaderEl.value
  if (showLeader && leader) {
    const sweep = leader.querySelector('.cx-leader-sweep')
    ;['3', '2', '1'].forEach((n, i) => {
      tl.call(() => { leaderNum.value = n }, undefined, i * 0.42)
        .fromTo(sweep, { '--sweep': '0deg' }, { '--sweep': '360deg', duration: 0.42, ease: 'none', immediateRender: false }, i * 0.42)
    })
    tl.to(leader, { autoAlpha: 0, duration: 0.25, ease: 'power1.in' }, 1.28)
    t = 1.3
    try { sessionStorage.setItem('cx-leader', '1') } catch { /* ok */ }
  }
  if (showShutters && shutterTop.value && shutterBottom.value) {
    tl.to(shutterTop.value, { yPercent: -100, duration: 1.3, ease: 'expo.inOut' }, t)
      .to(shutterBottom.value, { yPercent: 100, duration: 1.3, ease: 'expo.inOut' }, t)
      .set([shutterTop.value, shutterBottom.value], { display: 'none' })
    t += 0.35
  }
  tl.from('.cx-hero-bg', { scale: 1.3, autoAlpha: 0.3, duration: 2.4 }, t)
    .from('.cx-mark-char', { yPercent: 115, duration: 1.3, stagger: 0.08 }, t + 0.4)
    .from('.cx-mark-dot', { scale: 0, duration: 1, ease: 'back.out(2.4)' }, t + 0.85)
    .from('.cx-hero-copy .cx-word > span', { yPercent: 120, duration: 1.1, stagger: 0.045 }, t + 0.6)
    .from('.cx-hero-in', { autoAlpha: 0, y: 24, duration: 1, stagger: 0.08 }, t + 1.05)

  if (showShutters) {
    lockScroll(true)
    tl.call(() => lockScroll(false), undefined, Math.max(0.1, t - 0.2))
    // Quem já quer rolar não espera: acelera a abertura.
    const hurry = () => tl.timeScale(3.5)
    window.addEventListener('wheel', hurry, { once: true, passive: true })
    window.addEventListener('keydown', hurry, { once: true })
    window.addEventListener('touchstart', hurry, { once: true, passive: true })
    cleanups.push(() => {
      window.removeEventListener('wheel', hurry)
      window.removeEventListener('keydown', hurry)
      window.removeEventListener('touchstart', hurry)
      lockScroll(false)
    })
  }
  return tl
}

function initMotion() {
  const el = root.value
  if (!el) return
  enableSmooth()

  ctx = gsap.context(() => {
    mm = gsap.matchMedia()
    mm.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 900px)' }, context => {
      const { motion, desktop } = context.conditions as { motion: boolean; desktop: boolean }
      if (!motion) { el.classList.add('cx-static'); return () => el.classList.remove('cx-static') }
      el.classList.add('cx-motion')
      playIntro()

      /* Barra de progresso de leitura */
      const progress = document.querySelector<HTMLElement>('.reading-progress')
      if (progress) ScrollTrigger.create({ start: 0, end: 'max', onUpdate: self => { progress.style.transform = `scaleX(${self.progress})` } })

      /* ---------- Cena 1 · Hero: a câmera atravessa o ponto do "FB." ---------- */
      const mark = el.querySelector<HTMLElement>('.cx-mark')!
      const dot = el.querySelector<HTMLElement>('.cx-mark-dot')!
      const setPortalOrigin = () => gsap.set(mark, { transformOrigin: `${dot.offsetLeft + dot.offsetWidth / 2}px ${dot.offsetTop + dot.offsetHeight / 2}px` })
      setPortalOrigin()
      ScrollTrigger.addEventListener('refreshInit', setPortalOrigin)
      cleanups.push(() => ScrollTrigger.removeEventListener('refreshInit', setPortalOrigin))

      gsap.timeline({ scrollTrigger: { trigger: '.cx-hero', start: 'top top', end: '+=170%', scrub: true, pin: true, anticipatePin: 1 } })
        .to('.cx-hero-copy', { yPercent: -35, autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, 0)
        .to('.cx-hero-top, .cx-hero-meta', { autoAlpha: 0, duration: 0.2 }, 0)
        .to('.cx-sun', { yPercent: 55, duration: 0.7, ease: 'none' }, 0)
        .to('.cx-grid', { yPercent: 30, duration: 0.7, ease: 'none' }, 0)
        .to('.cx-stars', { yPercent: -22, duration: 0.7, ease: 'none' }, 0)
        .to('.cx-letterbox i', { scaleY: 1, duration: 0.45, ease: 'power2.out' }, 0)
        .to('.cx-hero-scene', { scale: 1.3, duration: 0.8, ease: 'power2.in' }, 0.2)
        .to(mark, { scale: 46, duration: 0.8, ease: 'power3.in' }, 0.22)
        .to('.cx-hero-flash', { autoAlpha: 1, duration: 0.08, ease: 'none' }, 0.94)
        .to('.cx-hero-fade', { autoAlpha: 1, duration: 0.14, ease: 'none' }, 0.96)

      /* ---------- Cena 2 · Manifesto: as palavras acendem, depois a câmera se afasta ---------- */
      gsap.timeline({ scrollTrigger: { trigger: '.cx-manifesto', start: 'top top', end: '+=150%', scrub: true, pin: true } })
        .fromTo('.cx-m-word', { opacity: 0.1 }, { opacity: 1, duration: 0.1, stagger: 0.04, ease: 'none' })
        .fromTo('.cx-manifesto-glow', { scale: 0.5, autoAlpha: 0 }, { scale: 1.2, autoAlpha: 1, duration: 1, ease: 'none' }, 0)
        .fromTo('.cx-manifesto-line', { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'none' }, 0)
        .to('.cx-manifesto-inner', { scale: 0.86, autoAlpha: 0, yPercent: -8, duration: 0.35, ease: 'power2.in' }, '+=0.1')

      /* ---------- Cartões de capítulo: letras se montam e a câmera mergulha ---------- */
      gsap.utils.toArray<HTMLElement>('.cx-chapter').forEach(chapter => {
        const chars = chapter.querySelectorAll('.cx-char')
        const half = chars.length / 2
        gsap.timeline({ scrollTrigger: { trigger: chapter, start: 'top top', end: '+=110%', scrub: true, pin: true } })
          .from(chars, {
            xPercent: i => (i - half) * 70,
            yPercent: i => (i % 2 ? 1 : -1) * (60 + (i % 3) * 40),
            rotate: i => (i % 2 ? 1 : -1) * 25,
            autoAlpha: 0,
            duration: 0.5,
            stagger: { each: 0.02, from: 'center' },
            ease: 'power3.out'
          })
          .from(chapter.querySelector('.cx-chapter-num'), { autoAlpha: 0, y: 30, duration: 0.25 }, 0.1)
          .from(chapter.querySelector('.cx-chapter-rule'), { scaleX: 0, duration: 0.4, ease: 'power2.out' }, 0.2)
          .from(chapter.querySelector('.cx-chapter-ghost'), { scale: 0.6, autoAlpha: 0, duration: 0.8, ease: 'none' }, 0)
          .to(chapter.querySelector('.cx-chapter-inner'), { scale: 2.4, autoAlpha: 0, duration: 0.35, ease: 'power2.in' }, '+=0.15')
          .to(chapter.querySelector('.cx-chapter-ghost'), { scale: 1.6, autoAlpha: 0, duration: 0.35, ease: 'power2.in' }, '<')
      })

      /* ---------- Títulos e textos de apoio ---------- */
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(title => {
        gsap.from(title.querySelectorAll('.cx-word > span'), {
          yPercent: 115, rotate: 4, duration: 1.2, ease: 'expo.out', stagger: 0.045,
          scrollTrigger: { trigger: title, start: 'top 85%' }
        })
      })
      gsap.utils.toArray<HTMLElement>('.cx-fade').forEach(item => {
        gsap.from(item, { autoAlpha: 0, y: 40, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 88%' } })
      })
      gsap.utils.toArray<HTMLElement>('.cx-scramble').forEach(label => {
        ScrollTrigger.create({ trigger: label, start: 'top 90%', once: true, onEnter: () => scramble(label) })
      })

      /* ---------- Cena 3 · Projetos: rolo horizontal com foco de câmera ---------- */
      if (desktop) {
        const track = el.querySelector<HTMLElement>('.cx-track')!
        const counter = el.querySelector<HTMLElement>('.cx-reel-count b')
        const distance = () => track.scrollWidth - window.innerWidth
        let lastIndex = 1
        const horizontal = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.cx-reel', start: 'top top', end: () => '+=' + distance() * 1.15, scrub: true, pin: true, invalidateOnRefresh: true,
            onUpdate: self => {
              el.style.setProperty('--reel', self.progress.toFixed(4))
              const index = Math.min(spotlight.length, Math.round(self.progress * (spotlight.length - 1)) + 1)
              if (counter && index !== lastIndex) {
                lastIndex = index
                counter.textContent = String(index).padStart(2, '0')
                gsap.fromTo(counter, { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.4, ease: 'expo.out' })
              }
            }
          }
        })
        gsap.utils.toArray<HTMLElement>('.cx-card').forEach(card => {
          const span = { containerAnimation: horizontal, trigger: card, start: 'left right', end: 'right left', scrub: true }
          // Foco: o cartão central fica nítido e grande, os vizinhos recuam e escurecem.
          gsap.timeline({ scrollTrigger: span })
            .fromTo(card, { scale: 0.8, rotateY: -14, transformPerspective: 1400 }, { scale: 1, rotateY: 0, duration: 1, ease: 'power2.out' })
            .to(card, { scale: 0.8, rotateY: 14, duration: 1, ease: 'power2.in' })
          gsap.timeline({ scrollTrigger: span })
            .fromTo(card.querySelector('.cx-card-dim'), { autoAlpha: 0.75 }, { autoAlpha: 0, duration: 1, ease: 'power2.out' })
            .to(card.querySelector('.cx-card-dim'), { autoAlpha: 0.75, duration: 1, ease: 'power2.in' })
          const media = card.querySelector('.cx-card-media > *')
          const shot = card.querySelector('.cx-card-shot')
          const num = card.querySelector('.cx-card-num')
          if (media) gsap.fromTo(media, { xPercent: -10 }, { xPercent: 10, ease: 'none', scrollTrigger: span })
          if (shot) gsap.fromTo(shot, { yPercent: 45, rotate: 9 }, { yPercent: -30, rotate: -5, ease: 'none', scrollTrigger: span })
          if (num) gsap.fromTo(num, { xPercent: 70 }, { xPercent: -70, ease: 'none', scrollTrigger: span })
          gsap.from(card.querySelectorAll('.cx-card-copy > *'), {
            y: 60, autoAlpha: 0, stagger: 0.07, ease: 'power3.out',
            scrollTrigger: { containerAnimation: horizontal, trigger: card, start: 'left 70%', end: 'left 25%', scrub: true }
          })
        })
      } else {
        gsap.utils.toArray<HTMLElement>('.cx-card').forEach(card => {
          gsap.fromTo(card, { scale: 0.9, y: 70 }, { scale: 1, y: 0, ease: 'power2.out', scrollTrigger: { trigger: card, start: 'top 98%', end: 'top 45%', scrub: true } })
          gsap.fromTo(card.querySelector('.cx-card-dim'), { autoAlpha: 0.7 }, { autoAlpha: 0, ease: 'none', scrollTrigger: { trigger: card, start: 'top 95%', end: 'top 40%', scrub: true } })
          const media = card.querySelector('.cx-card-media > *')
          if (media) gsap.fromTo(media, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: card, scrub: true } })
        })
      }

      /* ---------- Faixas de tecnologia: direção oposta e inclinação pela velocidade ---------- */
      const marqueeSpan = { trigger: '.cx-marquee', start: 'top bottom', end: 'bottom top', scrub: true }
      gsap.fromTo('.cx-marquee-a', { xPercent: 0 }, { xPercent: -35, ease: 'none', scrollTrigger: marqueeSpan })
      gsap.fromTo('.cx-marquee-b', { xPercent: -35 }, { xPercent: 0, ease: 'none', scrollTrigger: marqueeSpan })
      const skewTo = gsap.quickTo('.cx-marquee-row', 'skewX', { duration: 0.5, ease: 'power3' })
      ScrollTrigger.create({
        trigger: '.cx-marquee', start: 'top bottom', end: 'bottom top',
        onUpdate: self => skewTo(gsap.utils.clamp(-14, 14, self.getVelocity() / -200)),
        onLeave: () => skewTo(0), onLeaveBack: () => skewTo(0)
      })

      /* ---------- Engenharia: linhas se desenham e os itens entram em cascata ---------- */
      gsap.utils.toArray<HTMLElement>('.cx-cap').forEach((row, i) => {
        gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 90%', end: 'top 55%', scrub: true } })
          .from(row.querySelector('.cx-cap-line'), { scaleX: 0, ease: 'none' })
          .from(row.querySelectorAll('.cx-cap-num, h3, p, svg'), { x: 90 + i * 20, autoAlpha: 0, stagger: 0.1, ease: 'power2.out' }, 0)
      })

      /* ---------- Cena 4 · Sobre: portas se abrem e o monograma gira ---------- */
      gsap.timeline({ scrollTrigger: { trigger: '.cx-about', start: 'top top', end: '+=110%', scrub: true, pin: true } })
        .fromTo('.cx-door-seam', { scaleY: 0, autoAlpha: 1 }, { scaleY: 1, duration: 0.18, ease: 'power2.out' })
        .to('.cx-door-l', { xPercent: -101, duration: 0.6, ease: 'power3.inOut' }, 0.15)
        .to('.cx-door-r', { xPercent: 101, duration: 0.6, ease: 'power3.inOut' }, 0.15)
        .to('.cx-door-seam', { autoAlpha: 0, duration: 0.15 }, 0.2)
        .fromTo('.cx-about-mono', { rotateY: -70, rotateX: 18, scale: 0.6 }, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.8, ease: 'power2.out' }, 0.2)
        .fromTo('.cx-about-ring', { rotate: -90, scale: 0.7, autoAlpha: 0 }, { rotate: 120, scale: 1, autoAlpha: 1, duration: 1, ease: 'none' }, 0.2)
        .from('.cx-about .cx-word > span', { yPercent: 115, duration: 0.35, stagger: 0.03, ease: 'expo.out' }, 0.45)
        .from('.cx-about-in', { y: 40, autoAlpha: 0, duration: 0.3, stagger: 0.06, ease: 'power3.out' }, 0.55)

      /* ---------- Cena 5 · Contato: abertura em íris ---------- */
      gsap.timeline({ scrollTrigger: { trigger: '.cx-contact', start: 'top 90%', end: 'top top', scrub: true } })
        .fromTo('.cx-iris', { scale: 0.04 }, { scale: 1, ease: 'power2.in' })
        .fromTo('.cx-contact-inner', { scale: 0.85, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, ease: 'power1.out' }, 0.35)

      return () => el.classList.remove('cx-motion')
    })
  }, el)

  // Recalcula as posições quando as fontes terminam de carregar.
  document.fonts?.ready.then(() => ScrollTrigger.refresh())
  if (route.hash) {
    const hash = route.hash
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      scrollToTarget(hash, false)
    })
  }
}

function refresh() { ScrollTrigger.refresh() }

onMounted(() => {
  initMotion()
  window.addEventListener('load', refresh)
})
// O Vue chama onUnmounted no início da transição de saída (o DOM sai só no fim).
// Desfazer as animações nesse momento faria o layout pular com a cortina ainda abrindo,
// então a limpeza espera a cortina cobrir a tela.
onUnmounted(() => {
  window.removeEventListener('load', refresh)
  whenCovered().then(() => {
    cleanups.splice(0).forEach(fn => fn())
    mm?.revert()
    ctx?.revert()
    disableSmooth()
  })
})
</script>

<template>
<main ref="root" class="cx" tabindex="-1">
  <!-- Abertura -->
  <Teleport to="body">
    <div v-if="showLeader" ref="leaderEl" class="cx-leader" aria-hidden="true">
      <span class="cx-leader-sweep"></span>
      <span class="cx-leader-ring"></span>
      <span class="cx-leader-cross"></span>
      <strong>{{ leaderNum }}</strong>
    </div>
    <template v-if="showShutters">
      <div ref="shutterTop" class="cx-shutter cx-shutter-top" aria-hidden="true"></div>
      <div ref="shutterBottom" class="cx-shutter cx-shutter-bottom" aria-hidden="true"></div>
    </template>
  </Teleport>

  <!-- 01 · HERO -->
  <div id="inicio">
    <section class="cx-hero" aria-label="Apresentação">
      <div class="cx-hero-bg" aria-hidden="true">
        <div class="cx-hero-scene">
          <span class="cx-stars"></span>
          <span class="cx-sun"></span>
          <span class="cx-haze"></span>
          <span class="cx-grid"></span>
        </div>
      </div>
      <div class="cx-letterbox" aria-hidden="true"><i></i><i></i></div>

      <div class="cx-hero-top"><p class="cx-hero-label cx-hero-in">FELIPE BERNARDES <span>/</span> SOFTWARE ENGINEER</p></div>
      <div class="cx-mark" aria-hidden="true">
        <span class="cx-mask"><span class="cx-mark-char">F</span></span><span class="cx-mask"><span class="cx-mark-char">B</span></span><i class="cx-mark-dot"></i>
      </div>
      <div class="cx-hero-copy">
        <h1 class="cx-hero-title">
          <span class="cx-line"><Words text="Ideias grandes." /></span>
          <em class="cx-line"><Words text="Software à altura." /></em>
        </h1>
        <p class="cx-hero-lead cx-hero-in">Da arquitetura ao produto, experiências digitais que transformam negócios.</p>
        <RouterLink to="/#projetos" class="cx-hero-cta cx-hero-in"><span>DESCUBRA MEUS PROJETOS</span> <ArrowDown :size="18" /></RouterLink>
      </div>
      <div class="cx-hero-meta"><span class="cx-hero-in">PORTO ALEGRE · BRASIL</span><span class="cx-scroll-hint cx-hero-in"><i></i>ROLE PARA ENTRAR</span><span class="cx-hero-in">DESENVOLVIMENTO · EXPERIÊNCIA · PRODUTO</span></div>
      <div class="cx-hero-flash" aria-hidden="true"></div>
      <div class="cx-hero-fade" aria-hidden="true"></div>
    </section>
  </div>

  <!-- MANIFESTO -->
  <section class="cx-manifesto" aria-label="Manifesto">
    <div class="cx-manifesto-glow" aria-hidden="true"></div>
    <div class="cx-container cx-manifesto-inner">
      <span class="cx-kicker cx-scramble">MANIFESTO</span>
      <p class="cx-manifesto-text">
        <template v-for="(word, i) in manifesto" :key="i"><span class="cx-m-word" :class="{ 'is-hot': highlightWords.has(word) }">{{ word }}</span>{{ ' ' }}</template>
      </p>
      <span class="cx-manifesto-line" aria-hidden="true"></span>
    </div>
  </section>

  <!-- CAPÍTULO I -->
  <section class="cx-chapter" aria-hidden="true">
    <span class="cx-chapter-ghost">01</span>
    <div class="cx-chapter-inner">
      <span class="cx-chapter-num">CAPÍTULO 01</span>
      <p class="cx-chapter-title"><Chars text="O TRABALHO" /></p>
      <span class="cx-chapter-rule"></span>
    </div>
  </section>

  <!-- 02 · PROJETOS -->
  <section id="projetos" class="cx-projects">
    <div class="cx-container cx-projects-head">
      <div class="cx-section-top cx-fade"><span>01 / PROJETOS EM DESTAQUE</span><span>TRABALHOS SELECIONADOS — 2026</span></div>
      <h2 class="cx-title" data-reveal>
        <span class="cx-line"><Words text="Projetos reais." /></span>
        <em class="cx-line"><Words text="Resultados que importam." /></em>
      </h2>
      <p class="cx-sub cx-fade">Três soluções, desafios diferentes. Explore o que foi construído em cada uma delas.</p>
    </div>

    <div class="cx-reel">
      <div class="cx-reel-hud" aria-hidden="true">
        <span class="cx-reel-count"><b>01</b> / 03</span>
        <span class="cx-reel-bar"><i></i></span>
        <span>ROLE →</span>
      </div>
      <div class="cx-track">
        <RouterLink v-for="(item, index) in spotlight" :key="item.slug" :to="`/projetos/${item.slug}`" class="cx-card" :class="`cx-card-${item.className}`">
          <div class="cx-card-media" aria-hidden="true">
            <img v-if="item.image" :src="item.image" alt="" width="1800" height="1000" :loading="index === 0 ? 'eager' : 'lazy'" decoding="async" />
            <div v-else class="cx-armelin"><span>A</span></div>
          </div>
          <img v-if="item.detail" class="cx-card-shot" :src="item.detail" alt="" width="1320" height="945" loading="lazy" decoding="async" aria-hidden="true" />
          <div class="cx-card-shade" aria-hidden="true"></div>
          <span class="cx-card-num" aria-hidden="true">{{ item.num }}</span>
          <div class="cx-card-top"><span>{{ item.num }} / 03</span><ArrowUpRight :size="26" /></div>
          <div class="cx-card-copy">
            <span class="cx-card-label">{{ item.label }}</span>
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
            <small>{{ item.stack }}</small>
            <strong>EXPLORAR PROJETO <ArrowRight :size="16" /></strong>
          </div>
          <div class="cx-card-dim" aria-hidden="true"></div>
        </RouterLink>
      </div>
    </div>
  </section>

  <!-- TECNOLOGIAS -->
  <section class="cx-marquee" aria-label="Tecnologias">
    <div class="cx-marquee-row cx-marquee-a"><span v-for="n in 3" :key="'a'+n"><template v-for="t in marqueeA" :key="t">{{ t }}<i>✦</i></template></span></div>
    <div class="cx-marquee-row cx-marquee-b cx-outline"><span v-for="n in 3" :key="'b'+n"><template v-for="t in marqueeB" :key="t">{{ t }}<i>✦</i></template></span></div>
  </section>

  <!-- 03 · ENGENHARIA -->
  <section id="experiencia" class="cx-engineering">
    <div class="cx-eng-orb" data-speed="0.7" aria-hidden="true"></div>
    <div class="cx-container cx-split">
      <div class="cx-split-lead">
        <span class="cx-kicker cx-scramble">02 / ENGENHARIA</span>
        <h2 class="cx-title" data-reveal>
          <span class="cx-line"><Words text="Por trás da" /></span>
          <em class="cx-line"><Words text="experiência." /></em>
        </h2>
        <p class="cx-sub cx-fade">Código que sustenta produtos reais: APIs, segurança, integrações e plataformas preparadas para crescer.</p>
      </div>
      <div class="cx-caps">
        <div v-for="cap in capabilities" :key="cap.num" class="cx-cap">
          <span class="cx-cap-line" aria-hidden="true"></span>
          <span class="cx-cap-num">{{ cap.num }}</span>
          <div><h3>{{ cap.title }}</h3><p>{{ cap.text }}</p></div>
          <ArrowUpRight :size="24" />
        </div>
      </div>
    </div>
  </section>

  <!-- 04 · SOBRE -->
  <div id="sobre">
    <section class="cx-about">
      <div class="cx-doors" aria-hidden="true">
        <div class="cx-door cx-door-l"><span>SOBRE</span></div>
        <div class="cx-door cx-door-r"><span>MIM</span></div>
        <span class="cx-door-seam"></span>
      </div>
      <div class="cx-container cx-about-layout">
        <div class="cx-about-stage" aria-hidden="true">
          <span class="cx-about-ring"></span>
          <div class="cx-about-mono">FB<span>.</span></div>
        </div>
        <div class="cx-about-text">
          <span class="cx-kicker cx-about-in">03 / SOBRE MIM</span>
          <h2 class="cx-title">
            <span class="cx-line"><Words text="Tecnologia com" /></span>
            <em class="cx-line"><Words text="visão de produto." /></em>
          </h2>
          <p class="cx-sub cx-about-in">Sou desenvolvedor Full Stack e acredito que bom software nasce quando engenharia, entendimento de negócio e experiência trabalham juntos.</p>
          <a class="cx-link cx-about-in" href="https://www.linkedin.com/in/bernardesfelipe/" target="_blank" rel="noopener noreferrer">CONHEÇA MINHA TRAJETÓRIA <ArrowUpRight :size="19" /></a>
        </div>
      </div>
    </section>
  </div>

  <!-- 05 · CONTATO -->
  <section id="contato" class="cx-contact">
    <div class="cx-iris" aria-hidden="true"><span class="cx-iris-sun"></span></div>
    <div class="cx-container cx-contact-inner">
      <span class="cx-kicker cx-scramble">04 / PRÓXIMA HISTÓRIA</span>
      <h2 class="cx-title cx-contact-title" data-reveal>
        <span class="cx-line"><Words text="O próximo grande" /></span>
        <em class="cx-line"><Words text="projeto começa aqui." /></em>
      </h2>
      <p class="cx-sub">Vamos transformar sua visão em uma experiência digital de verdade.</p>
      <a class="cx-contact-primary" href="https://wa.me/5551994291091" target="_blank" rel="noopener noreferrer">VAMOS CONVERSAR <ArrowUpRight :size="23" /></a>
      <div class="cx-contact-social">
        <a href="https://github.com/bernardes98" target="_blank" rel="noopener noreferrer"><Github :size="19" /> GITHUB</a>
        <a href="https://www.linkedin.com/in/bernardesfelipe/" target="_blank" rel="noopener noreferrer"><Linkedin :size="19" /> LINKEDIN</a>
      </div>
    </div>
  </section>
</main>
</template>
