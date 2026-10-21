<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { ArrowLeft, ArrowUpRight, ArrowRight, Check, Github, Maximize2 } from 'lucide-vue-next'
import { projects } from '../data/projects'
import { setupScrollEffects } from '../utils/scrollEffects'
const route = useRoute()
const activeShot = ref(0)
const selectedShot = computed(() => project.value?.gallery?.[activeShot.value])
function galleryKeys(event: KeyboardEvent) { if (event.key === 'ArrowRight') { event.preventDefault(); moveShot(1) } else if (event.key === 'ArrowLeft') { event.preventDefault(); moveShot(-1) } }
function selectShot(index: number) { activeShot.value = index }
function moveShot(direction: number) { const len = project.value?.gallery?.length ?? 0; if (len) activeShot.value = (activeShot.value + direction + len) % len }
const project = computed(() => projects.find(p => p.slug === route.params.slug))
const nextProject = computed(() => { const idx=projects.findIndex(p=>p.slug===route.params.slug);return projects[(idx+1)%projects.length] })
let cleanup: (()=>void)|undefined
onMounted(() => {cleanup=setupScrollEffects(document.querySelector('.case-main')!)})
onUnmounted(() => cleanup?.())
watch(project, () => { activeShot.value = 0 })

</script>
<template>
<main class="case-main" tabindex="-1">
  <template v-if="project">
    <section class="case-hero" :class="'case-'+project.accent">
      <div class="case-aura" data-parallax></div>
      <div class="container case-wrap">
        <RouterLink class="back-link" to="/#projetos"><ArrowLeft :size="17"/> Voltar aos projetos</RouterLink>
        <div class="case-eyebrow"><span class="small-dot"></span> {{ project.number }} / ESTUDO DE CASO <span>— {{ project.year }}</span></div>
        <h1>{{ project.name }}<span class="full-stop">.</span></h1>
        <p class="case-lead">{{ project.description }}</p>
        <div class="case-facts"><div><span>TIPO</span><strong>{{ project.category }}</strong></div><div><span>STATUS</span><strong>{{ project.status }}</strong></div><div><span>TECNOLOGIAS</span><strong>{{ project.stack.join(' / ') }}</strong></div></div>
      </div>
      <div v-if="!project.gallery?.length" class="case-stage container" data-parallax><div class="stage-beam"></div><div class="stage-number">{{ project.number }}</div><div class="stage-content"><span>FEATURED PROJECT / {{ project.year }}</span><strong>{{ project.name }}</strong><small>{{ project.category }}</small></div><div class="stage-rings"></div></div>
    </section>
    <section v-if="project.gallery?.length" class="case-gallery-section" aria-label="Telas reais do projeto" @keydown="galleryKeys">
      <div class="container">
        <div class="gallery-head reveal"><span class="case-label">TELAS REAIS / {{ String(project.gallery.length).padStart(2,'0') }} VISTAS</span><a v-if="project.url" :href="project.url" target="_blank" rel="noopener noreferrer" class="gallery-site-link">Visitar site <ArrowUpRight :size="17"/></a></div>
        <div class="gallery-browser reveal" :class="{'gallery-mobile':selectedShot?.device === 'mobile'}">
          <div class="gallery-browser-bar"><div class="browser-lights"><i/><i/><i/></div><span>{{ project.name }} / {{ selectedShot?.title }}</span><span class="browser-index">{{ String(activeShot+1).padStart(2,'0') }} — {{ String(project.gallery.length).padStart(2,'0') }}</span></div>
          <div class="gallery-display"><Transition name="shot-fade" mode="out-in"><img v-if="selectedShot" :key="selectedShot.src" :src="selectedShot.src" :alt="`${project.name}: ${selectedShot.title}`" /></Transition></div>
        </div>
        <div class="gallery-bottom"><div><h2>{{ selectedShot?.title }}</h2><p>{{ selectedShot?.caption }}</p></div><div class="gallery-arrows"><a v-if="selectedShot" class="gallery-open" :href="selectedShot.src" target="_blank" rel="noopener noreferrer" :aria-label="`Ampliar imagem: ${selectedShot.title}`"><Maximize2 :size="18"/></a><button type="button" aria-label="Imagem anterior" @click="moveShot(-1)">←</button><button type="button" aria-label="Próxima imagem" @click="moveShot(1)">→</button></div></div>
        <div class="gallery-thumbs" aria-label="Selecionar tela"><button v-for="(shot,index) in project.gallery" :key="shot.src" type="button" :class="{selected:activeShot===index}" :aria-label="`Mostrar ${shot.title}`" :aria-pressed="activeShot===index" @click="selectShot(index)"><img :src="shot.src" :alt="shot.title" loading="lazy" /><span>{{ shot.title }}</span></button></div>
      </div>
    </section>
    <section class="case-section"><div class="container case-columns"><div class="case-label reveal">01 / O DESAFIO</div><div class="case-prose reveal"><h2>Um problema real.<br/><em>Uma solução inteligente.</em></h2><p>{{ project.challenge }}</p></div></div></section>
    <section class="case-section case-alt"><div class="container case-columns"><div class="case-label reveal">02 / A SOLUÇÃO</div><div class="case-prose reveal"><h2>Da arquitetura<br/><em>à experiência.</em></h2><p>{{ project.solution }}</p><div class="case-highlights"><div v-for="highlight in project.highlights" :key="highlight" class="highlight"><Check :size="18"/>{{ highlight }}</div></div></div></div></section>
    <section v-if="project.architecture?.length" class="case-section architecture-section"><div class="container case-columns"><div class="case-label reveal">03 / ARQUITETURA</div><div class="case-prose reveal"><h2>Por trás da<br/><em>interface.</em></h2><p>Uma visão resumida dos blocos do produto e das decisões de desenvolvimento, sem expor configurações internas ou informações sensíveis.</p><div class="architecture-flow"><div v-for="(step, index) in project.architecture" :key="step.label" class="architecture-node"><span class="architecture-order">{{ String(index+1).padStart(2,'0') }}</span><strong>{{ step.label }}</strong><span>{{ step.detail }}</span></div></div><div v-if="project.engineering?.length" class="engineering-list"><h3>Decisões técnicas e de produto</h3><p v-for="item in project.engineering" :key="item"><Check :size="17"/> {{ item }}</p></div></div></div></section>
    <section class="case-section"><div class="container case-columns"><div class="case-label reveal">04 / TECNOLOGIAS</div><div class="case-prose reveal"><h2>Construído com<br/><em>tecnologia sólida.</em></h2><div class="case-chips"><span v-for="tech in project.stack" :key="tech">{{ tech }}</span></div><p class="case-note">Este estudo de caso apresenta um resumo do projeto. As capturas apresentadas ilustram telas reais dos sistemas. Informações exibidas em ambientes de demonstração não representam necessariamente dados de clientes ou resultados comerciais.</p><a class="case-github" href="https://github.com/bernardes98" target="_blank" rel="noopener noreferrer"><Github :size="18"/> Conhecer meu GitHub <ArrowUpRight :size="17"/></a></div></div></section>
    <section class="next-case"><div class="container"><div class="case-label">PRÓXIMO PROJETO</div><RouterLink :to="`/projetos/${nextProject.slug}`"><span>{{ nextProject.name }}</span><ArrowRight :size="35"/></RouterLink></div></section>
  </template>
  <section v-else class="missing-project container"><h1>Projeto não encontrado.</h1><RouterLink to="/">Voltar ao início <ArrowRight :size="19"/></RouterLink></section>
</main>
</template>
