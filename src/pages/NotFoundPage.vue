<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="missing-project container">
    <span class="section-label">404 / PÁGINA NÃO ENCONTRADA</span>
    <h1>Essa página não existe<span class="full-stop">.</span></h1>
    <RouterLink to="/" class="btn btn-primary">
      Voltar ao início →
    </RouterLink>
  </main>
</template>
