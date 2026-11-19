<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { ArrowDown, ArrowUpRight, Github, Linkedin, ArrowRight } from 'lucide-vue-next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context | undefined
let mm: gsap.MatchMedia | undefined
let startTimer = 0

const spotlight = [
  { num: '01', name: 'Gestor de Vendas', label: 'PLATAFORMA SAAS', description: 'Operações, vendas e dados em um único lugar.', image: '/projects/cinematic/gestor-dashboard.webp', detail: '/projects/cinematic/gestor-graficos.webp', className: 'gestor', slug: 'gestor-de-vendas', stack: 'Java · Spring Boot · Vue · PWA' },
  { num: '02', name: 'Ateliê Tati Retamozo', label: 'EXPERIÊNCIA E-COMMERCE', description: 'Uma vitrine digital construída para encantar e vender.', image: '/projects/cinematic/atelie-home.webp', detail: '/projects/cinematic/atelie-catalogo.webp', className: 'atelie', slug: 'atelie-tati-retamozo', stack: 'E-commerce · API REST · Pagamentos' },
  { num: '03', name: 'Perfumaria Armelin', label: 'BACKEND E ARQUITETURA', description: 'Estrutura de software para um comércio que evolui.', image: '', detail: '', className: 'armelin', slug: 'perfumaria-armelin', stack: 'Java · Spring Security · REST' }
]

const manifesto = 'Não escrevo apenas código. Construo produtos que resolvem problemas reais — da API ao último pixel, com engenharia sólida, visão de negócio e atenção obsessiva aos detalhes.'
  .split(' ')
const highlightWords = new Set(['produtos', 'reais', 'engenharia', 'sólida,', 'detalhes.'])

const capabilities = [
  { num: '01', title: 'Backend & APIs', text: 'Java, Spring Boot, sistemas distribuídos e integrações.' },
  { num: '02', title: 'Frontend & UX', text: 'Vue, TypeScript, interfaces responsivas e experiência.' },
  { num: '03', title: 'Cloud & DevOps', text: 'AWS, Docker, bancos de dados e publicação.' }
]

const marqueeA = ['JAVA', 'SPRING BOOT', 'VUE', 'TYPESCRIPT', 'REST APIs', 'PWA']
const marqueeB = ['AWS', 'DOCKER', 'POSTGRESQL', 'SEGURANÇA', 'PRODUTO', 'UX']

function initMotion() {
  const el = root.value
  if (!el) return
  ctx = gsap.context(() => {
    mm = gsap.matchMedia()
    mm.add({
      motion: '(prefers-reduced-motion: no-preference)',
      desktop: '(min-width: 900px)'
    }, (context) => {
      const { motion, desktop } = context.conditions as { motion: boolean; desktop: boolean }
      if (!motion) {
        el.classList.add('cx-static')
        return () => el.classList.remove('cx-static')
      }
      el.classList.add('cx-motion')

      /* ---------- Abertura: as barras de cinema se abrem ---------- */
      const intro = gsap.timeline({ defaults: { ease: 'expo.out' } })
      intro
        .fromTo('.cx-shutter-top', { yPercent: 0 }, { yPercent: -100, duration: 1.4, ease: 'expo.inOut' }, 0.15)
        .fromTo('.cx-shutter-bottom', { yPercent: 0 }, { yPercent: 100, duration: 1.4, ease: 'expo.inOut' }, 0.15)
        .from('.cx-hero-bg', { scale: 1.35, filter: 'blur(14px) brightness(.4)', duration: 2.4 }, 0.3)
        .from('.cx-mark-char', { yPercent: 110, rotate: 6, duration: 1.4, stagger: 0.09 }, 0.75)
        .from('.cx-mark-dot', { scale: 0, duration: 1.1, ease: 'back.out(2.4)' }, 1.2)
        .from('.cx-hero .cx-word > span', { yPercent: 120, duration: 1.2, stagger: 0.05 }, 1.0)
        .from('.cx-hero-label, .cx-hero-lead, .cx-hero-cta, .cx-hero-meta > *', { opacity: 0, y: 24, duration: 1, stagger: 0.08 }, 1.5)

      /* ---------- Hero fixo: câmera avança enquanto o sol se põe ---------- */
      const hero = gsap.timeline({
        scrollTrigger: { trigger: '.cx-hero', start: 'top top', end: '+=140%', scrub: 1, pin: true }
      })
      hero
        .to('.cx-hero-bg', { scale: 1.25, ease: 'none' }, 0)
        .to('.cx-sun', { yPercent: 70, scale: 1.25, filter: 'hue-rotate(-25deg) saturate(1.5)', ease: 'none' }, 0)
        .to('.cx-stars', { yPercent: -25, opacity: 1, ease: 'none' }, 0)
        .to('.cx-grid', { yPercent: 18, scaleY: 1.4, ease: 'none' }, 0)
        .to('.cx-mark', { scale: 3.4, yPercent: -12, opacity: 0, filter: 'blur(10px)', ease: 'power2.in' }, 0)
        .to('.cx-hero-copy', { y: -140, opacity: 0, filter: 'blur(8px)', ease: 'power1.in' }, 0)
        .to('.cx-hero-label, .cx-hero-meta', { opacity: 0, ease: 'none' }, 0)
        .to('.cx-letterbox', { '--bar': '11vh', ease: 'none' }, 0)
        .to('.cx-hero-fade', { opacity: 1, ease: 'none' }, 0.55)

      /* ---------- Manifesto: as palavras acendem com o scroll ---------- */
      gsap.timeline({
        scrollTrigger: { trigger: '.cx-manifesto', start: 'top top', end: '+=130%', scrub: 0.6, pin: true }
      })
        .fromTo('.cx-manifesto .cx-m-word', { opacity: 0.12, y: 10 }, { opacity: 1, y: 0, stagger: 0.08, ease: 'none' })
        .fromTo('.cx-manifesto-glow', { scale: 0.6, opacity: 0 }, { scale: 1.3, opacity: 1, ease: 'none', duration: 2 }, 0)
        .to('.cx-manifesto-line', { scaleX: 1, ease: 'none', duration: 2 }, 0)

      /* ---------- Títulos de seção: revelação por máscara ---------- */
      gsap.utils.toArray<HTMLElement>('.cx-title').forEach(title => {
        gsap.from(title.querySelectorAll('.cx-word > span'), {
          yPercent: 115, rotate: 4, duration: 1.2, ease: 'expo.out', stagger: 0.045,
          scrollTrigger: { trigger: title, start: 'top 85%' }
        })
      })
      gsap.utils.toArray<HTMLElement>('.cx-fade').forEach(item => {
        gsap.from(item, { opacity: 0, y: 40, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 88%' } })
      })

      /* ---------- Projetos ---------- */
      if (desktop) {
        const track = el.querySelector<HTMLElement>('.cx-track')!
        const distance = () => track.scrollWidth - window.innerWidth
        const horizontal = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.cx-reel', start: 'top top', end: () => '+=' + distance(), scrub: 1, pin: true,
            invalidateOnRefresh: true,
            onUpdate: self => {
              el.style.setProperty('--reel', self.progress.toFixed(4))
              const index = Math.min(spotlight.length, Math.floor(self.progress * spotlight.length) + 1)
              const counter = el.querySelector('.cx-reel-count b')
              if (counter) counter.textContent = String(index).padStart(2, '0')
            }
          }
        })
        gsap.utils.toArray<HTMLElement>('.cx-card').forEach(card => {
          const img = card.querySelector('.cx-card-media img, .cx-armelin')
          const shot = card.querySelector('.cx-card-shot')
          const copy = card.querySelector('.cx-card-copy')
          const num = card.querySelector('.cx-card-num')
          const base = { containerAnimation: horizontal, trigger: card, scrub: true, start: 'left right', end: 'right left' }
          if (img) gsap.fromTo(img, { xPercent: -14, scale: 1.18 }, { xPercent: 14, scale: 1.05, ease: 'none', scrollTrigger: base })
          if (shot) gsap.fromTo(shot, { yPercent: 40, rotate: 8 }, { yPercent: -30, rotate: -4, ease: 'none', scrollTrigger: base })
          if (num) gsap.fromTo(num, { xPercent: 60 }, { xPercent: -60, ease: 'none', scrollTrigger: base })
          if (copy) gsap.from(copy.children, {
            y: 60, opacity: 0, stagger: 0.07, ease: 'power3.out',
            scrollTrigger: { containerAnimation: horizontal, trigger: card, start: 'left 75%', end: 'left 30%', scrub: true }
          })
          gsap.fromTo(card, { clipPath: 'inset(12% 8% 12% 8% round 34px)' }, {
            clipPath: 'inset(0% 0% 0% 0% round 28px)', ease: 'none',
            scrollTrigger: { containerAnimation: horizontal, trigger: card, start: 'left 95%', end: 'left 35%', scrub: true }
          })
        })
      } else {
        gsap.utils.toArray<HTMLElement>('.cx-card').forEach(card => {
          gsap.fromTo(card, { clipPath: 'inset(10% 6% 10% 6% round 28px)', y: 60 }, {
            clipPath: 'inset(0% 0% 0% 0% round 22px)', y: 0, ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 95%', end: 'top 45%', scrub: true }
          })
          const img = card.querySelector('.cx-card-media img')
          if (img) gsap.fromTo(img, { yPercent: -8, scale: 1.2 }, { yPercent: 8, scale: 1.1, ease: 'none', scrollTrigger: { trigger: card, scrub: true } })
        })
      }

      /* ---------- Faixas de tecnologias guiadas pelo scroll ---------- */
      gsap.fromTo('.cx-marquee-a', { xPercent: 0 }, { xPercent: -35, ease: 'none', scrollTrigger: { trigger: '.cx-marquee', start: 'top bottom', end: 'bottom top', scrub: 0.5 } })
      gsap.fromTo('.cx-marquee-b', { xPercent: -35 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: '.cx-marquee', start: 'top bottom', end: 'bottom top', scrub: 0.5 } })
      const skewTo = gsap.quickTo('.cx-marquee-row', 'skewX', { duration: 0.5, ease: 'power3' })
      ScrollTrigger.create({
        trigger: '.cx-marquee', start: 'top bottom', end: 'bottom top',
        onUpdate: self => skewTo(gsap.utils.clamp(-12, 12, self.getVelocity() / -220)),
        onLeave: () => skewTo(0), onLeaveBack: () => skewTo(0)
      })

      /* ---------- Engenharia ---------- */
      gsap.utils.toArray<HTMLElement>('.cx-cap').forEach((row, i) => {
        gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 88%', end: 'top 55%', scrub: 0.8 } })
          .from(row.querySelector('.cx-cap-line'), { scaleX: 0, ease: 'none' })
          .from(row.querySelectorAll('.cx-cap-num, h3, p, svg'), { x: 80 + i * 20, opacity: 0, stagger: 0.1, ease: 'power2.out' }, 0)
      })
      if (desktop) {
        gsap.to('.cx-eng-orb', { yPercent: 60, rotate: 140, ease: 'none', scrollTrigger: { trigger: '.cx-engineering', start: 'top bottom', end: 'bottom top', scrub: true } })
      }

      /* ---------- Sobre: monograma 3D ---------- */
      gsap.fromTo('.cx-about-mono', { rotateY: -55, rotateX: 18, scale: 0.75, opacity: 0.2 }, {
        rotateY: 25, rotateX: -8, scale: 1.05, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: '.cx-about', start: 'top bottom', end: 'bottom top', scrub: 1 }
      })
      gsap.fromTo('.cx-about-ring', { rotate: 0 }, { rotate: 220, ease: 'none', scrollTrigger: { trigger: '.cx-about', start: 'top bottom', end: 'bottom top', scrub: true } })

      /* ---------- Contato: abertura em íris ---------- */
      gsap.timeline({ scrollTrigger: { trigger: '.cx-contact', start: 'top 85%', end: 'top 10%', scrub: 1 } })
        .fromTo('.cx-iris', { clipPath: 'circle(6% at 50% 60%)' }, { clipPath: 'circle(85% at 50% 50%)', ease: 'none' })
        .fromTo('.cx-contact-inner', { scale: 0.86, opacity: 0.2 }, { scale: 1, opacity: 1, ease: 'none' }, 0)

      return () => el.classList.remove('cx-motion')
    })
  }, el)
  requestAnimationFrame(() => ScrollTrigger.refresh())
}

onMounted(() => {
  const transitioning = document.querySelector('.cinematic-enter-active')
  startTimer = window.setTimeout(initMotion, transitioning ? 850 : 0)
  window.addEventListener('load', refresh)
})
function refresh() { ScrollTrigger.refresh() }
onUnmounted(() => {
  clearTimeout(startTimer)
  window.removeEventListener('load', refresh)
  mm?.revert()
  ctx?.revert()
})
</script>

<template>
<main ref="root" class="cx" tabindex="-1">
  <div class="cx-grain" aria-hidden="true"></div>
  <div class="cx-vignette" aria-hidden="true"></div>
  <div class="cx-shutter cx-shutter-top" aria-hidden="true"></div>
  <div class="cx-shutter cx-shutter-bottom" aria-hidden="true"></div>

  <!-- 01 · HERO -->
  <section id="inicio" class="cx-hero" aria-label="Apresentação">
    <div class="cx-hero-bg" aria-hidden="true">
      <span class="cx-stars"></span>
      <span class="cx-sun"></span>
      <span class="cx-haze"></span>
      <span class="cx-grid"></span>
    </div>
    <div class="cx-letterbox" aria-hidden="true"><i></i><i></i></div>

    <p class="cx-hero-label">FELIPE BERNARDES <span>/</span> SOFTWARE ENGINEER</p>
    <div class="cx-mark" aria-hidden="true">
      <span class="cx-mask"><span class="cx-mark-char">F</span></span><span class="cx-mask"><span class="cx-mark-char">B</span></span><i class="cx-mark-dot"></i>
    </div>
    <div class="cx-hero-copy">
      <h1 class="cx-hero-title">
        <span class="cx-line"><span class="cx-word"><span>Ideias</span></span> <span class="cx-word"><span>grandes.</span></span></span>
        <em class="cx-line"><span class="cx-word"><span>Software</span></span> <span class="cx-word"><span>à</span></span> <span class="cx-word"><span>altura.</span></span></em>
      </h1>
      <p class="cx-hero-lead">Da arquitetura ao produto, experiências digitais que transformam negócios.</p>
      <a href="#projetos" class="cx-hero-cta"><span>DESCUBRA MEUS PROJETOS</span> <ArrowDown :size="18" /></a>
    </div>
    <div class="cx-hero-meta"><span>PORTO ALEGRE · BRASIL</span><span class="cx-scroll-hint"><i></i>ROLE PARA ENTRAR</span><span>DESENVOLVIMENTO · EXPERIÊNCIA · PRODUTO</span></div>
    <div class="cx-hero-fade" aria-hidden="true"></div>
  </section>

  <!-- MANIFESTO -->
  <section class="cx-manifesto" aria-label="Manifesto">
    <div class="cx-manifesto-glow" aria-hidden="true"></div>
    <div class="cx-container">
      <span class="cx-kicker">MANIFESTO</span>
      <p class="cx-manifesto-text">
        <template v-for="(word, i) in manifesto" :key="i"><span class="cx-m-word" :class="{ 'is-hot': highlightWords.has(word) }">{{ word }}</span>{{ ' ' }}</template>
      </p>
      <span class="cx-manifesto-line" aria-hidden="true"></span>
    </div>
  </section>

  <!-- 02 · PROJETOS -->
  <section id="projetos" class="cx-projects">
    <div class="cx-container cx-projects-head">
      <div class="cx-section-top cx-fade"><span>01 / PROJETOS EM DESTAQUE</span><span>TRABALHOS SELECIONADOS — 2026</span></div>
      <h2 class="cx-title">
        <span class="cx-line"><span class="cx-word"><span>Projetos</span></span> <span class="cx-word"><span>reais.</span></span></span>
        <em class="cx-line"><span class="cx-word"><span>Resultados</span></span> <span class="cx-word"><span>que</span></span> <span class="cx-word"><span>importam.</span></span></em>
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
        <a v-for="item in spotlight" :key="item.slug" :href="`/projetos/${item.slug}`" class="cx-card" :class="`cx-card-${item.className}`">
          <div class="cx-card-media" aria-hidden="true">
            <img v-if="item.image" :src="item.image" alt="" loading="lazy" />
            <div v-else class="cx-armelin"><span>A</span></div>
          </div>
          <img v-if="item.detail" class="cx-card-shot" :src="item.detail" alt="" loading="lazy" aria-hidden="true" />
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
        </a>
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
    <div class="cx-eng-orb" aria-hidden="true"></div>
    <div class="cx-container cx-split">
      <div class="cx-split-lead">
        <span class="cx-kicker cx-fade">02 / ENGENHARIA</span>
        <h2 class="cx-title">
          <span class="cx-line"><span class="cx-word"><span>Por</span></span> <span class="cx-word"><span>trás</span></span> <span class="cx-word"><span>da</span></span></span>
          <em class="cx-line"><span class="cx-word"><span>experiência.</span></span></em>
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
  <section id="sobre" class="cx-about">
    <div class="cx-container cx-about-layout">
      <div class="cx-about-stage" aria-hidden="true">
        <span class="cx-about-ring"></span>
        <div class="cx-about-mono">FB<span>.</span></div>
      </div>
      <div class="cx-about-text">
        <span class="cx-kicker cx-fade">03 / SOBRE MIM</span>
        <h2 class="cx-title">
          <span class="cx-line"><span class="cx-word"><span>Tecnologia</span></span> <span class="cx-word"><span>com</span></span></span>
          <em class="cx-line"><span class="cx-word"><span>visão</span></span> <span class="cx-word"><span>de</span></span> <span class="cx-word"><span>produto.</span></span></em>
        </h2>
        <p class="cx-sub cx-fade">Sou desenvolvedor Full Stack e acredito que bom software nasce quando engenharia, entendimento de negócio e experiência trabalham juntos.</p>
        <a class="cx-link cx-fade" href="https://www.linkedin.com/in/bernardesfelipe/" target="_blank" rel="noopener noreferrer">CONHEÇA MINHA TRAJETÓRIA <ArrowUpRight :size="19" /></a>
      </div>
    </div>
  </section>

  <!-- 05 · CONTATO -->
  <section id="contato" class="cx-contact">
    <div class="cx-iris" aria-hidden="true"><span class="cx-iris-sun"></span></div>
    <div class="cx-container cx-contact-inner">
      <span class="cx-kicker">04 / PRÓXIMA HISTÓRIA</span>
      <h2 class="cx-title cx-contact-title">
        <span class="cx-line"><span class="cx-word"><span>O</span></span> <span class="cx-word"><span>próximo</span></span> <span class="cx-word"><span>grande</span></span></span>
        <em class="cx-line"><span class="cx-word"><span>projeto</span></span> <span class="cx-word"><span>começa</span></span> <span class="cx-word"><span>aqui.</span></span></em>
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
