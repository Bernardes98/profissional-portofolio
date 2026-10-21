# V11 — acabamento e publicação

A V11 mantém as seções cinematográficas da V10, incluindo o scroll corrigido. Novidades:

- Entradas de projetos e página 404 carregadas por demanda (Vue Router).
- Imagens do hero atualizadas para as versões limpas em `/projects/cinematic/`.
- Foco visível no teclado e preferência de movimento reduzido.
- HTML estático com metadados específicos para cada estudo de caso, além da aplicação Vue. Isso permite a bots que não executam JavaScript lerem título, descrição e imagem social.

## Testar

```bash
npm install
npm run build
npm run preview
```

Abra a home e as três URLs `/projetos/...`. Em `dist/projetos/<slug>/index.html` estão os metadados de compartilhamento. Verifique também a navegação entre as páginas e o scroll.

## Antes de publicar

Configure `VITE_SITE_URL=https://seudominio.com.br` em `.env.production` (ou nas variáveis da hospedagem). O build cria links absolutos de imagens no Open Graph, canonical e sitemap. **Não use localhost como domínio de publicação.**

A hospedagem deve servir os arquivos estáticos existentes antes do fallback SPA para `/index.html`. Em Vercel e Netlify, valide a resposta HTML de uma rota de projeto, pois a precedência dos rewrites depende da configuração do provedor.

Depois do deploy, inspecione o código-fonte (View Source) de cada página pública e teste previews no WhatsApp e LinkedIn. Verifique que as screenshots publicadas não contêm dados privados.
