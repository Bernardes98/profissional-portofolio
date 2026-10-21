import { writeFileSync, rmSync, readFileSync, existsSync } from 'node:fs'
let dotenvUrl = ''
const envPath = new URL('../.env.production', import.meta.url)
if (existsSync(envPath)) {
  const match = readFileSync(envPath, 'utf8').match(/^\s*VITE_SITE_URL\s*=\s*['"]?([^'"\r\n#]+)['"]?/m)
  if (match) dotenvUrl = match[1].trim()
}
const domain = (process.env.SITE_URL || process.env.VITE_SITE_URL || dotenvUrl).trim().replace(/\/$/, '')
const file = new URL('../dist/sitemap.xml', import.meta.url)
if (!domain) {
  rmSync(file, { force: true })
  console.log('Sitemap omitido: defina SITE_URL com o domínio definitivo para gerar URLs corretas.')
  process.exit(0)
}
let origin
try { origin = new URL(domain) } catch { console.error('SITE_URL inválida.'); process.exit(1) }
if (!['https:', 'http:'].includes(origin.protocol) || origin.pathname !== '/' || origin.search || origin.hash) {
  console.error('SITE_URL deve ser apenas a origem HTTPS (ex.: https://dominio.com.br).'); process.exit(1)
}
const routes = ['/', '/projetos/gestor-de-vendas', '/projetos/atelie-tati-retamozo', '/projetos/perfumaria-armelin']
const urls = routes.map(route => `  <url><loc>${origin.origin}${route}</loc></url>`).join('\n')
writeFileSync(file, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
console.log(`Sitemap gerado: ${routes.length} páginas para ${origin.origin}`)
