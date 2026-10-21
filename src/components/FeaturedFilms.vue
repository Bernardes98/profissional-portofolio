<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowUpRight } from 'lucide-vue-next'
const films = [
  {id:'gestor-de-vendas',count:'01',label:'SOFTWARE / SAAS',name:'Gestor de Vendas',description:'Operação, inteligência e decisões. Uma plataforma feita para conectar o dia a dia de negócios reais.',image:'/projects/cinematic/gestor-dashboard.webp',secondary:'/projects/cinematic/gestor-graficos.webp',tone:'violet',stack:'JAVA · SPRING BOOT · VUE · TYPESCRIPT'},
  {id:'atelie-tati-retamozo',count:'02',label:'COMMERCE / EXPERIENCE',name:'Ateliê Tati Retamozo',description:'Da identidade à compra. Uma jornada digital com experiência de vitrine e ferramentas para gerir pedidos.',image:'/projects/cinematic/atelie-home.webp',secondary:'/projects/cinematic/atelie-catalogo.webp',tone:'wine',stack:'E-COMMERCE · API REST · CHECKOUT · UX'}
]
</script>
<template>
  <section class="featured-films" aria-label="Projetos em destaque">
    <div class="container featured-films-intro reveal">
      <span class="section-label"><span class="small-dot"></span> 01 / PRODUCT REVEAL</span>
      <h2 class="motion-heading"><span class="motion-line"><span class="motion-line-inner">Software real.</span></span><span class="motion-line"><span class="motion-line-inner"><em>Apresentado em grande escala.</em></span></span></h2>
      <p>Role para explorar duas experiências digitais, suas interfaces e decisões de produto.</p>
    </div>
    <article v-for="film in films" :key="film.id" class="feature-film" :class="`feature-film-${film.tone}`" data-film-progress>
      <div class="feature-film-stage">
        <div class="feature-film-light"></div>
        <div class="feature-film-background" :style="{'background-image':`url(${film.image})`}"></div>
        <div class="feature-film-frame">
          <div class="feature-film-top"><span class="feature-film-dot"></span><span>PROJECT / {{ film.count }}</span><span>{{ film.label }}</span></div>
          <div class="feature-film-screen"><img :src="film.image" :alt="`Interface do projeto ${film.name}`" loading="lazy" decoding="async"/></div>
          <div class="feature-film-small"><img :src="film.secondary" alt="Outra tela do sistema" loading="lazy" decoding="async"/></div>
        </div>
        <div class="feature-film-content container">
          <span class="feature-film-kicker">{{ film.count }} / SELECTED WORK · 2026</span>
          <h3>{{ film.name }}</h3>
          <p>{{ film.description }}</p>
          <span class="feature-film-stack">{{ film.stack }}</span>
          <RouterLink :to="`/projetos/${film.id}`" class="feature-film-link">Explorar estudo de caso <ArrowUpRight :size="20"/></RouterLink>
        </div>
        <div class="feature-film-index" aria-hidden="true">{{ film.count }}</div>
      </div>
    </article>
  </section>
</template>
