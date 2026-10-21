# V9 — Abertura Cinematográfica

A V9 preserva a seção de produtos e estudos de caso da V8 e redesenha a abertura com:

- headline editorial e elementos visuais em profundidade;
- movimento de câmera associado ao scroll via requestAnimationFrame;
- camadas dos sistemas reais com deslocamentos independentes;
- luz atmosférica e textura discreta;
- redução de movimento para `prefers-reduced-motion`;
- sem contêiner sticky adicional no hero, evitando repetir o problema da tela preta.

## Testar no Mac

```bash
npm install
npm run build
npm run dev
```

Não foi possível validar o build no ambiente de geração devido à ausência de dependências no cache npm. Se o build apontar erro, envie a saída do terminal.

### Principais arquivos alterados

- `src/pages/HomePage.vue`
- `src/utils/scrollEffects.ts`
- `src/main.ts`
- `src/v9-hero.css` (novo)
