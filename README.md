# Felipe Bernardes — Portfolio Dark Cinematic v2

Vue 3 + TypeScript + Vite + Vue Router + Anime.js 4.

## Rodando localmente

```bash
npm install
npm run dev
npm run build
```

## Navegação
- `/` — página principal, hero animado, projetos, sobre, expertise e contatos
- `/projetos/gestor-de-vendas` — estudo de caso do SaaS
- `/projetos/atelie-tati-retamozo` — estudo de caso do e-commerce
- `/projetos/perfumaria-armelin` — estudo de caso da API em desenvolvimento

## Personalizar
- `src/data/projects.ts`: descrições, tecnologias e desafios dos projetos.
- `src/pages/ProjectPage.vue`: estrutura dos estudos de caso.
- `src/pages/HomePage.vue`: conteúdo da página inicial.
- `src/App.vue`: navegação e redes sociais.
- `src/cinematic.css`: transições, efeitos e páginas individuais.

## Links
- GitHub: https://github.com/bernardes98
- LinkedIn: https://www.linkedin.com/in/bernardesfelipe/
- WhatsApp: https://wa.me/5551994291091

Os visuais dos cards e das capas são ilustrações em CSS, não capturas dos sistemas. Não foram adicionadas métricas nem URLs públicas não verificadas.

## Deploy
Configure rewrites de SPA para servir `index.html` nas rotas `/projetos/*`. Em Nginx, use `try_files $uri $uri/ /index.html;`.

## Acessibilidade
O site respeita `prefers-reduced-motion`, tem navegação por links reais e usa IntersectionObserver para animações de entrada. O cursor, se houver, permanece nativo.


## Imagens reais dos projetos (V3)
As 9 capturas enviadas foram convertidas para WebP e salvas em `public/projects/`.
Edite legendas e ordem de exibição em `src/data/projects.ts`. A galeria oferece miniaturas, navegação anterior/próxima e suporta screenshots mobile.
Links públicos: gestordevendas.online e atelietatiretamozo.com.br. Verifique se os ambientes demonstrados estão adequados para divulgação pública.
O projeto Perfumaria Armelin mantém a arte de apresentação anterior até receber capturas reais.


## V4 — casos técnicos

As páginas individuais incluem diagrama resumido da arquitetura, decisões técnicas, galerias com navegação por teclado (setas quando o foco está na galeria) e botão para ampliar cada captura. Edite `src/data/projects.ts` para manter as descrições consistentes com o código real.
