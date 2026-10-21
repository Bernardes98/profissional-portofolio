import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { projects } from '../data/projects'

const name = 'Felipe Bernardes'
const baseDescription = 'Portfólio de Felipe Bernardes, desenvolvedor Full Stack. Conheça projetos reais de Java, Spring Boot, Vue, TypeScript, SaaS e e-commerce.'
const siteUrl = (import.meta.env.VITE_SITE_URL || '').replace(/\/$/, '')

function setMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, key)
    document.head.appendChild(tag)
  }
  tag.content = content
}

export function updateSeo(route: RouteLocationNormalizedLoaded) {
  const project = route.name === 'project' ? projects.find(item => item.slug === route.params.slug) : undefined
  const isMissing = route.name === 'not-found' || (route.name === 'project' && !project)
  const title = isMissing ? `Página não encontrada | ${name}` : project ? `${project.name} | ${name}` : `${name} | Desenvolvedor Full Stack`
  const description = isMissing ? 'A página solicitada não foi encontrada.' : project?.description ?? baseDescription
  document.title = title
  setMeta('meta[name="description"]', 'name', 'description', description)
  setMeta('meta[name="robots"]', 'name', 'robots', isMissing ? 'noindex, follow' : 'index, follow')
  setMeta('meta[property="og:type"]', 'property', 'og:type', 'website')
  setMeta('meta[property="og:locale"]', 'property', 'og:locale', 'pt_BR')
  setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', name)
  setMeta('meta[property="og:title"]', 'property', 'og:title', title)
  setMeta('meta[property="og:description"]', 'property', 'og:description', description)
  setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
  // URL canônica só deve existir quando um domínio público definitivo for configurado.
  const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (siteUrl) {
    const absolute = `${siteUrl}${route.path === '/' ? '/' : route.path}`
    let link = canonical
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link) }
    link.href = absolute
    setMeta('meta[property="og:url"]', 'property', 'og:url', absolute)
    setMeta('meta[property="og:image"]', 'property', 'og:image', `${siteUrl}/og-cover.png`)
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', `${siteUrl}/og-cover.png`)
  } else {
    canonical?.remove()
    document.head.querySelector('meta[property="og:url"]')?.remove()
    document.head.querySelector('meta[property="og:image"]')?.remove()
    document.head.querySelector('meta[name="twitter:image"]')?.remove()
  }
}
