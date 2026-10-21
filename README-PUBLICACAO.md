# Felipe Portfolio — V5 / Publicação

## Teste local

```bash
npm install
npm run build
npm run dev
```

## Domínio e SEO

O projeto **não pressupõe domínio próprio**. Quando o domínio definitivo estiver confirmado, crie `.env.production` com:

```dotenv
VITE_SITE_URL=https://seu-dominio.com.br
```

O build usa esse valor para `sitemap.xml` (4 rotas). Sem a variável, omite o sitemap para não divulgar URLs erradas. `robots.txt` permanece válido. O canonical e o Open Graph URL são atualizados pela aplicação quando ela é executada no navegador.

**Importante:** sites que fazem o preview do WhatsApp/LinkedIn normalmente **não executam JavaScript**. Para previews específicos de cada projeto, será necessário prerender/SSR. O HTML base já inclui dados genéricos de compartilhamento, mas por padrão não inclui `og:image` absoluto até definir o domínio.

## Deploy na Vercel

1. Suba este projeto no GitHub (nunca envie `.env` com segredos).
2. Importe o repositório na Vercel como projeto Vite, com raiz no diretório `felipe-portfolio` caso o repositório tenha pasta-mãe.
3. Build: `npm run build` e output: `dist`.
4. Configure `VITE_SITE_URL` com o domínio definitivo nas variáveis de ambiente.
5. Configure o domínio na Vercel e faça novo deploy.
6. Confira `/`, `/projetos/gestor-de-vendas`, `/robots.txt`, `/sitemap.xml` e imagem `/og-cover.png`.

O arquivo `vercel.json` implementa o fallback de SPA para páginas abertas diretamente. O `_redirects` também permite usar Netlify.

## Checklist antes de publicar

- Revise textos técnicos e status dos produtos.
- Confirme se as capturas não exibem informações privadas; o portfólio incluirá as imagens publicamente.
- Confira as URLs de GitHub, LinkedIn, WhatsApp, Gestor de Vendas e Ateliê.
- Teste responsividade e navegação com teclado.
- Opcional: usar pré-renderização para meta tags individuais das páginas em bots sociais.
