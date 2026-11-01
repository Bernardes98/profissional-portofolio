<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { ArrowDown, ArrowUpRight, Github, Linkedin, ArrowRight } from 'lucide-vue-next'
import { projects } from '../data/projects'

const root = ref<HTMLElement|null>(null)
let observer: IntersectionObserver | undefined
let scrollRaf = 0
let played = false
const heroVisible = ref(true)

function updateScroll() {
  scrollRaf = 0
  const el = root.value
  if (!el) return
  const y = window.scrollY
  el.style.setProperty('--gta-scroll', String(Math.min(y, window.innerHeight * 1.2)))
}
function scrollHandler() { if (!scrollRaf) scrollRaf = requestAnimationFrame(updateScroll) }
function onFirstInteraction() { played = true }

onMounted(() => {
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-shown')
    })
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px' })
  root.value?.querySelectorAll('.gta-reveal').forEach(el => observer?.observe(el))
  window.addEventListener('scroll', scrollHandler, { passive: true })
  window.addEventListener('wheel', onFirstInteraction, { passive: true, once: true })
  window.addEventListener('touchstart', onFirstInteraction, { passive: true, once: true })
  updateScroll()
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(() => { heroVisible.value = true })
  }
})
onUnmounted(() => {
  observer?.disconnect()
  window.removeEventListener('scroll', scrollHandler)
  window.removeEventListener('wheel', onFirstInteraction)
  window.removeEventListener('touchstart', onFirstInteraction)
  if (scrollRaf) cancelAnimationFrame(scrollRaf)
})

const spotlight = [
  { num:'01', name: 'Gestor de Vendas', label:'PLATAFORMA SAAS', description:'Operações, vendas e dados em um único lugar.', image:'/projects/cinematic/gestor-dashboard.webp', className:'gestor', slug:'gestor-de-vendas' },
  { num:'02', name:'Ateliê Tati Retamozo', label:'EXPERIÊNCIA E-COMMERCE', description:'Uma vitrine digital construída para encantar e vender.', image:'/projects/cinematic/atelie-home.webp', className:'atelie', slug:'atelie-tati-retamozo' },
  { num:'03', name:'Perfumaria Armelin', label:'BACKEND E ARQUITETURA', description:'Estrutura de software para um comércio que evolui.', image:'', className:'armelin', slug:'perfumaria-armelin' }
]
</script>

<template>
<main ref="root" class="gta-portfolio" tabindex="-1">
  <section id="inicio" class="gta-intro" aria-label="Apresentação">
    <div class="gta-intro-backdrop" aria-hidden="true"><span class="gta-sun"></span><span class="gta-horizon"></span></div>
    <div class="gta-intro-inner" :class="{'is-ready':heroVisible}">
      <p class="gta-small-label">FELIPE BERNARDES / SOFTWARE ENGINEER</p>
      <div class="gta-intro-mark" aria-label="F B"><span>F</span><span>B</span><i>.</i></div>
      <h1>Ideias grandes.<br/><em>Software à altura.</em></h1>
      <p class="gta-intro-lead">Da arquitetura ao produto, experiências digitais que transformam negócios.</p>
      <a href="#projetos" class="gta-hero-scroll">DESCUBRA MEUS PROJETOS <ArrowDown :size="18" /></a>
    </div>
    <div class="gta-intro-bottom"><span>PORTO ALEGRE · BRASIL</span><span>DESENVOLVIMENTO · EXPERIÊNCIA · PRODUTO</span></div>
  </section>

  <section id="projetos" class="gta-section gta-project-section">
    <div class="gta-container">
      <div class="gta-section-top gta-reveal"><span>01 / PROJETOS EM DESTAQUE</span><span>TRABALHOS SELECIONADOS — 2026</span></div>
      <h2 class="gta-section-title gta-reveal">Projetos reais.<br/><em>Resultados que importam.</em></h2>
      <p class="gta-section-sub gta-reveal">Três soluções, desafios diferentes. Explore o que foi construído em cada uma delas.</p>
      <div class="gta-featured-cards">
        <a v-for="item in spotlight" :key="item.slug" :href="`/projetos/${item.slug}`" class="gta-featured-card gta-reveal" :class="`gta-card-${item.className}`">
          <div class="gta-card-visual" aria-hidden="true">
            <img v-if="item.image" :src="item.image" alt="" loading="lazy" />
            <div v-else class="gta-armelin-visual"><span>A</span><span>ARMELIN</span></div>
          </div>
          <div class="gta-card-shade"></div>
          <div class="gta-card-top"><span>{{ item.num }} / 03</span><ArrowUpRight :size="24" /></div>
          <div class="gta-card-content"><span>{{ item.label }}</span><h3>{{ item.name }}</h3><p>{{ item.description }}</p><strong>EXPLORAR PROJETO <ArrowRight :size="16" /></strong></div>
        </a>
      </div>
    </div>
  </section>

  <section id="experiencia" class="gta-section gta-engineering">
    <div class="gta-container gta-split">
      <div class="gta-split-lead gta-reveal"><span class="gta-kicker">02 / ENGENHARIA</span><h2>Por trás da<br/><em>experiência.</em></h2><p>Código que sustenta produtos reais: APIs, segurança, integrações e plataformas preparadas para crescer.</p></div>
      <div class="gta-capability-list">
        <div class="gta-reveal"><span>01</span><div><h3>Backend & APIs</h3><p>Java, Spring Boot, sistemas distribuídos e integrações.</p></div><ArrowUpRight :size="21"/></div>
        <div class="gta-reveal"><span>02</span><div><h3>Frontend & UX</h3><p>Vue, TypeScript, interfaces responsivas e experiência.</p></div><ArrowUpRight :size="21"/></div>
        <div class="gta-reveal"><span>03</span><div><h3>Cloud & DevOps</h3><p>AWS, Docker, bancos de dados e publicação.</p></div><ArrowUpRight :size="21"/></div>
      </div>
    </div>
  </section>

  <section id="sobre" class="gta-section gta-about">
    <div class="gta-container gta-about-layout">
      <div class="gta-about-monogram gta-reveal" aria-hidden="true">FB<span>.</span></div>
      <div class="gta-about-text gta-reveal"><span class="gta-kicker">03 / SOBRE MIM</span><h2>Tecnologia com<br/><em>visão de produto.</em></h2><p>Sou desenvolvedor Full Stack e acredito que bom software nasce quando engenharia, entendimento de negócio e experiência trabalham juntos.</p><a href="https://www.linkedin.com/in/bernardesfelipe/" target="_blank" rel="noopener noreferrer">CONHEÇA MINHA TRAJETÓRIA <ArrowUpRight :size="19"/></a></div>
    </div>
  </section>

  <section id="contato" class="gta-section gta-contact">
    <div class="gta-container gta-contact-inner gta-reveal"><span class="gta-kicker">04 / PRÓXIMA HISTÓRIA</span><h2>O próximo grande<br/><em>projeto começa aqui.</em></h2><p>Vamos transformar sua visão em uma experiência digital de verdade.</p><a class="gta-contact-primary" href="https://wa.me/5551994291091" target="_blank" rel="noopener noreferrer">VAMOS CONVERSAR <ArrowUpRight :size="23" /></a><div class="gta-contact-social"><a href="https://github.com/bernardes98" target="_blank" rel="noopener noreferrer"><Github :size="19"/> GITHUB</a><a href="https://www.linkedin.com/in/bernardesfelipe/" target="_blank" rel="noopener noreferrer"><Linkedin :size="19"/> LINKEDIN</a></div></div>
  </section>
</main>
</template>
