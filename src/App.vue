<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { Github, Linkedin, Menu, X, ArrowUpRight } from 'lucide-vue-next'
const menuOpen = ref(false)
const route = useRoute()
const routeKey = computed(() => route.fullPath)
const year = new Date().getFullYear()
function closeMenu(){menuOpen.value = false}
function onAfterEnter(){document.querySelector('main')?.focus({preventScroll:true})}
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
    <RouterView v-slot="{ Component }"><Transition name="cinematic" mode="out-in" @after-enter="onAfterEnter"><div :key="routeKey" class="route-canvas"><component :is="Component" /></div></Transition></RouterView>
    <footer class="footer"><div class="container footer-inner"><RouterLink to="/" class="logo">F<span>.</span>B<span class="logo-slash">/</span></RouterLink><span>© {{ year }} FELIPE BERNARDES. FEITO COM INTENÇÃO.</span><div class="footer-social"><a href="https://github.com/bernardes98" target="_blank" rel="noopener noreferrer" aria-label="GitHub de Felipe"><Github :size="19"/></a><a href="https://www.linkedin.com/in/bernardesfelipe/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de Felipe"><Linkedin :size="19"/></a><a href="https://wa.me/5551994291091" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp de Felipe">WA</a><RouterLink to="/" aria-label="Voltar ao início"><ArrowUpRight :size="19"/></RouterLink></div></div></footer>
  </div>
</template>
