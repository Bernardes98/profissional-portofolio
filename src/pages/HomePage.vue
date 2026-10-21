<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { animate, stagger } from 'animejs'
import { ArrowDownRight, ArrowUpRight, ArrowRight, Code2, Layers3, Rocket, MoveRight } from 'lucide-vue-next'
import ProjectCard from '../components/ProjectCard.vue'
import FeaturedFilms from '../components/FeaturedFilms.vue'
import { projects } from '../data/projects'
import { setupScrollEffects } from '../utils/scrollEffects'

const heroShots = [
  { src: '/projects/cinematic/gestor-dashboard.webp', label: 'GESTOR DE VENDAS', tone: 'violet' },
  { src: '/projects/cinematic/atelie-home.webp', label: 'ATELIÊ TATI RETAMOZO', tone: 'rose' },
  { src: '/projects/cinematic/gestor-login-mobile.webp', label: 'MOBILE EXPERIENCE', tone: 'gold' }
]

let cleanup: (() => void) | undefined
let destroyHeroMotion: (() => void) | undefined

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!reduced) {
    animate('.intro-animate', {
      opacity: [0, 1],
      y: [36, 0],
      duration: 1100,
      delay: stagger(120),
      ease: 'outExpo'
    })

    animate('.hero-scene .scene-card', {
      opacity: [0, 1],
      y: [64, 0],
      duration: 1250,
      delay: stagger(170, { start: 350 }),
      ease: 'outExpo'
    })

  }

  const hero = document.querySelector<HTMLElement>('.cinematic-hero')
  if (hero && !reduced) {
    const onMove = (event: MouseEvent) => {
      const rect = hero.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      hero.style.setProperty('--pointer-x', `${x * 26}px`)
      hero.style.setProperty('--pointer-y', `${y * 26}px`)
      hero.style.setProperty('--spot-x', `${(event.clientX - rect.left) / rect.width * 100}%`)
      hero.style.setProperty('--spot-y', `${(event.clientY - rect.top) / rect.height * 100}%`)
    }
    const onLeave = () => {
      hero.style.setProperty('--pointer-x', '0px')
      hero.style.setProperty('--pointer-y', '0px')
      hero.style.setProperty('--spot-x', '72%')
      hero.style.setProperty('--spot-y', '35%')
    }
    hero.addEventListener('mousemove', onMove)
    hero.addEventListener('mouseleave', onLeave)
    destroyHeroMotion = () => {
      hero.removeEventListener('mousemove', onMove)
      hero.removeEventListener('mouseleave', onLeave)
    }
  }

  cleanup = setupScrollEffects(document.querySelector('main')!)
})

onUnmounted(() => {
  cleanup?.()
  destroyHeroMotion?.()
})
</script>

<template>
  <main>
    <section id="inicio" class="cinematic-hero v9-hero">
      <div class="hero-noise"></div>
      <div class="hero-grid-lines"></div>
      <div class="hero-vignette"></div>
      <div class="hero-spotlight"></div>
      <div class="v9-stage-light" aria-hidden="true"></div>
      <div class="v9-cinema-index" aria-hidden="true">F / B — 2026&nbsp;&nbsp; • &nbsp;&nbsp;ENGINEERING × EXPERIENCE</div>
      <div class="container cinematic-layout">
        <div class="hero-copy-block v9-hero-copy">
          <div class="eyebrow cinematic-eyebrow intro-animate">
            <span class="eyebrow-dash"></span>
            PORTFÓLIO / FELIPE BERNARDES
            <span class="eyebrow-end">— FULL STACK ENGINEER</span>
          </div>

          <p class="hero-kicker intro-animate">DESENVOLVEDOR FULL STACK / PORTO ALEGRE, BR</p>

          <h1 class="cinematic-title intro-animate">
            Arquitetura<br />
            <span>que se move.</span><br />
            Produto que<br />
            permanece<span class="full-stop">.</span>
          </h1>

          <p class="cinematic-description intro-animate">
            Desenvolvo experiências digitais que unem <strong>engenharia robusta</strong>,
            movimento intencional e <strong>soluções reais</strong> — de plataformas SaaS a e-commerce.
          </p>

          <div class="hero-buttons intro-animate">
            <a class="btn btn-primary cinematic-button motion-magnetic" href="/#projetos">Ver projetos <ArrowUpRight :size="18"/></a>
            <a class="btn btn-outline cinematic-button-secondary motion-magnetic" href="/#contato">Falar comigo <ArrowRight :size="18"/></a>
          </div>

          <div class="cinematic-metadata intro-animate">
            <span><i></i>JAVA / SPRING BOOT</span>
            <span><i></i>VUE / TYPESCRIPT</span>
            <span><i></i>SAAS / E-COMMERCE / APIs</span>
          </div>
        </div>

        <div class="hero-scene v9-hero-scene" aria-hidden="true">
          <div class="film-halo halo-one"></div>
          <div class="film-halo halo-two"></div>
          <div class="scene-beam"></div>
          <div class="v9-scene-reticle"></div>
          <div class="v9-scene-counter"><span>01</span> / 03 <small>PRODUCT FRAMES</small></div>
          <div class="scene-card card-a">
            <span class="scene-chip">{{ heroShots[0].label }}</span>
            <img :src="heroShots[0].src" :alt="heroShots[0].label" fetchpriority="high" decoding="async" />
          </div>
          <div class="scene-card card-b">
            <span class="scene-chip">{{ heroShots[1].label }}</span>
            <img :src="heroShots[1].src" :alt="heroShots[1].label" decoding="async" />
          </div>
          <div class="scene-card card-c scene-card-mobile">
            <span class="scene-chip">{{ heroShots[2].label }}</span>
            <img :src="heroShots[2].src" :alt="heroShots[2].label" decoding="async" />
          </div>
          <div class="scene-caption">PROJETOS REAIS / CAMADAS EM MOVIMENTO</div>
        </div>
      </div>

      <div class="container hero-footnote intro-animate">
        <span>PORTO ALEGRE — BR</span>
        <a href="/#projetos">ROLE PARA EXPLORAR <ArrowDownRight :size="16"/></a>
        <span>BUILDING SOFTWARE THAT FEELS INTENTIONAL</span>
      </div>
    </section>

    <section class="proof-strip">
      <div class="container proof-grid reveal">
        <div>
          <strong>03</strong>
          <span>Projetos principais apresentados com estudo de caso</span>
        </div>
        <div>
          <strong>02</strong>
          <span>Produtos reais com capturas e contexto técnico</span>
        </div>
        <div>
          <strong>FULL STACK</strong>
          <span>Backend, frontend, regras de negócio, UX e publicação</span>
        </div>
      </div>
    </section>

    <section class="scroll-cinema" aria-label="Jornada visual dos projetos">
      <div class="scroll-cinema-sticky">
        <div class="scroll-cinema-backdrop"></div>
        <div class="container scroll-cinema-inner">
          <div class="scroll-cinema-copy">
            <div class="section-label"><span class="small-dot"></span> PRODUCT STORIES / SCROLL EXPERIENCE</div>
            <p class="scroll-cinema-overline">A engenharia por trás do visual.</p>
            <h2>Três cenas.<br /><em>Produtos reais.</em></h2>
            <div class="scroll-cinema-steps">
              <div class="scroll-cinema-step is-active"><span>01 / GESTÃO</span><strong>Controle com clareza</strong><p>Painel operacional, vendas e dados em um só lugar.</p></div>
              <div class="scroll-cinema-step"><span>02 / INTELIGÊNCIA</span><strong>Decisões guiadas por dados</strong><p>Indicadores e análises que tornam resultados visíveis.</p></div>
              <div class="scroll-cinema-step"><span>03 / EXPERIÊNCIA</span><strong>Da vitrine ao checkout</strong><p>Uma experiência de compra que valoriza o negócio.</p></div>
            </div>
            <div class="scroll-cinema-indicator"><span>SCROLL / PROGRESS</span><div class="scroll-cinema-track"><span class="scroll-cinema-progress-fill"></span></div><span>03 SCENES</span></div>
          </div>
          <div class="scroll-cinema-visual">
            <div class="scroll-cinema-light"></div>
            <div class="scroll-cinema-scene is-active" aria-hidden="false"><img src="/projects/gestor-dashboard.webp" alt="Dashboard real do Gestor de Vendas" loading="lazy"/><span>GESTOR DE VENDAS / DASHBOARD</span></div>
            <div class="scroll-cinema-scene" aria-hidden="true"><img src="/projects/gestor-graficos.webp" alt="Gráficos reais do Gestor de Vendas" loading="lazy"/><span>GESTOR DE VENDAS / ANALYTICS</span></div>
            <div class="scroll-cinema-scene" aria-hidden="true"><img src="/projects/atelie-home.webp" alt="Site real do Ateliê Tati Retamozo" loading="lazy"/><span>ATELIÊ TATI RETAMOZO / E-COMMERCE</span></div>
            <span class="scroll-cinema-frame-label">ENGINEERED TO FEEL DIFFERENT · 2026</span>
          </div>
        </div>
        <span class="scroll-cinema-side-number">FB / 2026</span>
      </div>
    </section>

    <FeaturedFilms />

    <section id="projetos" class="work-section section-pad work-section-cinematic">
      <div class="container">
        <div class="section-label reveal"><span class="small-dot"></span> 01 / TRABALHOS SELECIONADOS</div>
        <div class="section-header reveal cinematic-section-header">
          <h2 class="motion-heading"><span class="motion-line"><span class="motion-line-inner">Casos reais com</span></span><span class="motion-line"><span class="motion-line-inner"><em>arquitetura e impacto.</em></span></span></h2>
          <p>
            Produtos digitais construídos com foco em resultado, clareza operacional e uma experiência visual que valoriza o software.
          </p>
        </div>
        <div class="projects-grid cinematic-projects-grid">
          <ProjectCard v-for="project in projects" :key="project.number" :project="project" />
        </div>
        <div class="section-tail reveal"><span>SOFTWARE, PRODUTO E EXPERIÊNCIA</span><span>↗ 2026</span></div>
      </div>
    </section>

    <section id="sobre" class="about-section section-pad about-section-cinematic">
      <div class="container about-grid cinematic-about-grid">
        <div class="about-aside reveal">
          <div class="section-label"><span class="small-dot"></span> 02 / SOBRE MIM</div>
          <div class="identity-card identity-card-cinematic motion-float" data-scroll-depth="0.09">
            <span class="identity-monogram">FB<span>.</span></span>
            <div class="identity-quote">
              <p>Desenvolvo com foco em performance, clareza e valor de negócio.</p>
              <span>DESIGN × CODE × PRODUCT</span>
            </div>
          </div>
        </div>

        <div class="about-main reveal">
          <h2 class="motion-heading"><span class="motion-line"><span class="motion-line-inner">Menos template.</span></span><span class="motion-line"><span class="motion-line-inner"><em>Mais direção.</em></span></span></h2>
          <p>
            Sou desenvolvedor Full Stack com experiência em aplicações corporativas, integrações, APIs e sistemas web orientados a operação.
            Gosto de construir soluções que resolvem problemas reais e, ao mesmo tempo, transmitam cuidado no acabamento visual.
          </p>
          <p>
            Meu trabalho conecta backend robusto, frontend moderno e visão de produto — para que o software seja confiável por dentro e marcante por fora.
          </p>
          <div class="about-highlights">
            <div>
              <strong>Java + Spring Boot</strong>
              <span>APIs, regras de negócio, segurança e arquitetura em camadas.</span>
            </div>
            <div>
              <strong>Vue + TypeScript</strong>
              <span>Interfaces responsivas, animações e foco em experiência.</span>
            </div>
          </div>
          <a class="text-link" href="/#contato">Vamos criar algo juntos <ArrowUpRight :size="20"/></a>
        </div>
      </div>
    </section>

    <section id="experiencia" class="expertise-section section-pad expertise-section-cinematic">
      <div class="container">
        <div class="section-label reveal"><span class="small-dot"></span> 03 / ESPECIALIDADES</div>
        <div class="section-header reveal cinematic-section-header">
          <h2 class="motion-heading"><span class="motion-line"><span class="motion-line-inner">Da estrutura técnica</span></span><span class="motion-line"><span class="motion-line-inner"><em>ao produto final.</em></span></span></h2>
          <p>
            Uma atuação full stack que combina arquitetura, interface, lógica de negócio e publicação.
          </p>
        </div>
        <div class="expertise-grid">
          <div class="expertise-item reveal cinematic-panel motion-float">
            <div class="expertise-icon"><Code2 :size="28"/></div>
            <span>01</span>
            <h3>Backend & APIs</h3>
            <p>Java, Spring Boot, endpoints REST, autenticação, segurança e organização em camadas para sistemas que precisam evoluir com confiança.</p>
          </div>
          <div class="expertise-item reveal cinematic-panel motion-float">
            <div class="expertise-icon"><Layers3 :size="28"/></div>
            <span>02</span>
            <h3>Frontend & motion</h3>
            <p>Interfaces com Vue e TypeScript, componentes reutilizáveis, responsividade e animações que adicionam presença sem prejudicar a usabilidade.</p>
          </div>
          <div class="expertise-item reveal cinematic-panel motion-float">
            <div class="expertise-icon"><Rocket :size="28"/></div>
            <span>03</span>
            <h3>Produto & entrega</h3>
            <p>Produtos SaaS, e-commerce, integrações, publicação, SEO técnico e atenção às decisões que afetam o negócio de ponta a ponta.</p>
          </div>
        </div>
        <div class="stack-marquee reveal" aria-label="Tecnologias">
          <span>JAVA</span><b>✳</b><span>SPRING BOOT</span><b>✳</b><span>VUE.JS</span><b>✳</b><span>TYPESCRIPT</span><b>✳</b><span>SQL</span><b>✳</b><span>DOCKER</span>
        </div>
      </div>
    </section>

    <section id="contato" class="contact-section contact-section-cinematic">
      <div class="contact-glow"></div>
      <div class="container contact-content">
        <div class="section-label reveal"><span class="small-dot"></span> 04 / CONTATO</div>
        <h2 class="motion-heading"><span class="motion-line"><span class="motion-line-inner">Se a ideia é séria,</span></span><span class="motion-line"><span class="motion-line-inner"><em>vamos construir direito.</em></span></span></h2>
        <p class="reveal">
          Disponível para oportunidades, projetos e conversas sobre software, produto e experiências digitais.
        </p>
        <div class="contact-actions reveal">
          <a class="btn btn-primary cinematic-button motion-magnetic" href="https://wa.me/5551994291091?text=Ol%C3%A1%2C%20Felipe!%20Vi%20seu%20portf%C3%B3lio." target="_blank" rel="noopener noreferrer">
            Entrar em contato <MoveRight :size="20"/>
          </a>
          <span>GitHub, LinkedIn e WhatsApp já conectados no rodapé.</span>
        </div>
      </div>
    </section>
  </main>
</template>
