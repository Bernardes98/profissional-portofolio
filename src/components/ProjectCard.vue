<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { PortfolioProject } from '../data/projects'
import { ArrowUpRight } from 'lucide-vue-next'
defineProps<{ project: PortfolioProject }>()
</script>
<template>
  <article class="project-card reveal motion-float" :class="'theme-'+project.accent">
    <div class="project-art" :class="'art-'+project.kind" aria-hidden="true">
      <RouterLink v-if="project.gallery?.length" :to="`/projetos/${project.slug}`" class="project-real-shot" data-scroll-depth="0.055" tabindex="-1" aria-hidden="true"><img :src="project.gallery[0].src" :alt="project.gallery[0].title" loading="lazy" /></RouterLink>
      <div v-if="project.gallery?.length" class="preview-label">PROJETO REAL <span>↗</span></div>
      <template v-if="!project.gallery?.length && project.kind === 'sales'">
        <div class="mock-window sales-window"><div class="mock-top"><i/><i/><i/><span>GESTOR / DASHBOARD</span></div><div class="sales-ui"><div class="mock-side"><div class="mock-brand"></div><span/><span/><span/><span/></div><div class="mock-content"><div class="mock-title"></div><div class="mock-metrics"><span/><span/><span/></div><div class="mock-chart"><b v-for="n in 12" :key="n" :style="{height: (20 + (n * 19 % 69)) + '%'}"></b></div></div></div></div>
      </template>
      <template v-else-if="!project.gallery?.length && project.kind === 'atelier'"><div class="atelier-preview"><span>ATELIÊ</span><strong>Tati Retamozo</strong><i class="cake-illustration">✺</i><small>CONFEITARIA AUTORAL</small></div></template>
      <template v-else-if="!project.gallery?.length"><div class="perfume-preview"><div class="bottle"><span>ARMELIN</span><small>PARFUM</small></div><span class="perfume-copy">A new essence<br/>of commerce.</span></div></template>
      <div class="art-grain"></div>
    </div>
    <div class="project-body">
      <div class="project-topline"><span>{{ project.number }} / {{ project.category }}</span><span>{{ project.year }}</span></div>
      <div class="project-heading"><h3><RouterLink :to="`/projetos/${project.slug}`">{{ project.name }}</RouterLink></h3><RouterLink :to="`/projetos/${project.slug}`" :aria-label="'Ver estudo de caso: '+project.name" class="project-link"><ArrowUpRight :size="21"/></RouterLink></div>
      <p>{{ project.description }}</p>
      <div class="tags"><span v-for="tech in project.stack" :key="tech">{{ tech }}</span></div>
    </div>
  </article>
</template>
