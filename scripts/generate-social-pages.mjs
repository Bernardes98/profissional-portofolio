import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'

const root = resolve('dist')
const indexFile = join(root, 'index.html')
if (!existsSync(indexFile)) throw new Error('Execute vite build antes de gerar páginas sociais.')
const base = readFileSync(indexFile, 'utf8')
const env = resolve('.env.production')
const declared = existsSync(env) ? readFileSync(env, 'utf8').match(/^\s*VITE_SITE_URL\s*=\s*['"]?([^'"\r\n#]+)['"]?/m)?.[1]?.trim() : ''
const origin = (process.env.SITE_URL || process.env.VITE_SITE_URL || declared || '').replace(/\/$/, '')
const site = origin ? new URL(origin) : null
if (site && (site.protocol !== 'https:' || site.pathname !== '/' || site.search || site.hash)) throw new Error('SITE_URL precisa ser uma origem HTTPS, sem caminho.')

const pages = [
  {slug:'gestor-de-vendas',name:'Gestor de Vendas',description:'Plataforma SaaS para vendas, pedidos, fornecedores, estoque e indicadores. Estudo de caso por Felipe Bernardes.',image:'projects/cinematic/gestor-dashboard.webp'},
  {slug:'atelie-tati-retamozo',name:'Ateliê Tati Retamozo',description:'E-commerce de confeitaria artesanal com catálogo, checkout, pagamentos e painel administrativo. Estudo de caso por Felipe Bernardes.',image:'projects/cinematic/atelie-home.webp'},
  {slug:'perfumaria-armelin',name:'Perfumaria Armelin',description:'Projeto de API de comércio em Java e Spring Boot, com organização em camadas e atenção à segurança.',image:'og-cover.png'}
]
const escape = value => String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
const set = (html, name, value, attr = 'property') => {
  const regex = new RegExp(`<meta\\s+${attr}="${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`, 'i')
  const tag = `<meta ${attr}="${name}" content="${escape(value)}" />`
  return regex.test(html) ? html.replace(regex, tag) : html.replace('</head>', `  ${tag}\n</head>`)
}
for (const page of pages) {
  const title = `${page.name} | Felipe Bernardes`
  const path = `/projetos/${page.slug}`
  let html = base.replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`)
  html = set(html, 'description', page.description, 'name')
  html = set(html, 'og:title', title)
  html = set(html, 'og:description', page.description)
  html = set(html, 'twitter:title', title, 'name')
  html = set(html, 'twitter:description', page.description, 'name')
  if (site) {
    const canonical = `${site.origin}${path}`
    html = set(html, 'og:url', canonical)
    html = set(html, 'og:image', `${site.origin}/${page.image}`)
    html = set(html, 'twitter:image', `${site.origin}/${page.image}`, 'name')
    html = html.replace('</head>', `  <link rel="canonical" href="${escape(canonical)}" />\n</head>`)
  }
  const target = join(root, 'projetos', page.slug)
  mkdirSync(target, {recursive:true})
  writeFileSync(join(target, 'index.html'), html)
}
if (site) {
  let html = base
  html = set(html, 'og:url', `${site.origin}/`)
  html = set(html, 'og:image', `${site.origin}/og-cover.png`)
  html = set(html, 'twitter:image', `${site.origin}/og-cover.png`, 'name')
  html = html.replace('</head>', `  <link rel="canonical" href="${escape(site.origin)}/" />\n</head>`)
  writeFileSync(indexFile, html)
}
console.log(`HTML de compartilhamento gerado para ${pages.length} projetos${site ? ` em ${site.origin}` : ' (configure SITE_URL para imagens absolutas)'}.`)
