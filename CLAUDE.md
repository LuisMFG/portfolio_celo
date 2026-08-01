# CLAUDE.md — portfólio Luís Marcelo

## Redesign em andamento: conceito "Dev Terminal"

`design/prototype.html` é a direção visual aprovada e a fonte da verdade.
Leia esse arquivo antes de qualquer decisão de espaçamento, escala ou timing.

### Tokens (em `src/styles/tokens.css`)

```
--bg      #0A0A0A    --surface #111111    --line   #1F1F1F
--text    #EDEDED    --muted   #7A7A7A    --accent #00E676
--ease    cubic-bezier(0.16, 1, 0.3, 1)
```

Um único acento em todo o site. `[ok]` usa `--accent`, `[wip]` usa `--muted`.
Não existe cor de status separada — não invente uma.

### Tipografia

JetBrains Mono via `next/font/local`. Carregar só os pesos usados: 300, 400, 500.

- Display do hero: `clamp(3.5rem, 13vw, 15rem)` · `-0.04em` · lh `0.9` · **peso 500**
- Nome de projeto: `clamp(1.3rem, 3.4vw, 2.9rem)` · `-0.035em` · lh `1` · peso 400
- Marquee: `clamp(1.4rem, 4vw, 3.4rem)` · `-0.03em` · peso 300
- Subtítulo do hero: `clamp(.8rem, 1.1vw, 1rem)` · tracking `.24em` · uppercase · peso 300
- Labels/meta: `11px` · tracking `.18em`–`.2em` · uppercase · cor `--muted`

### Espaço

- Gutter lateral: `clamp(20px, 3vw, 44px)`
- Seção padrão: `clamp(64px, 9vw, 140px)` vertical
- Seção de destaque: `clamp(70px, 11vw, 180px)` vertical
- Grid de fundo: 12 colunas, `border-left: 1px solid var(--line)`, `opacity: .5`

### Movimento — números exatos do protótipo

- Entrada `rise`: `translateY(100%) → 0`. Hero h1 `1.05s`; demais `0.9s`.
  Delays em cascata: `.05 / .09 / .13 / .16 / .20 / .28 / .50 / .62s`
- Marquee: `28s` linear infinito; no hover a duração vira `28 / 0.6 ≈ 46.67s`
- Digitação: `28ms` por caractere com jitter de `-12` a `+34ms`; dispara com
  IntersectionObserver `threshold: 0.35`, uma vez só
- Cursor: anel lerp `0.12`; preview lerp `0.16` com offset `(+34x, -96y)`
- Preview: rotação = velocidade horizontal × `0.5`, limitada a `±14°`, decaimento `0.86`
- Hover em link: dot `scale(0.4)`, anel `scale(1.9)`, opacidade `.55 → 1`
- Hover em projeto: `translate3d(14px,0,0)` em `0.6s`; cor em `0.35s`

### Stack — restrições rígidas

- Next.js App Router + TypeScript + Tailwind.
- PROIBIDO: GSAP, Three.js, AOS, qualquer lib de animação extra.
- O protótipo roda inteiro com CSS + um único `requestAnimationFrame`.
  Framer Motion só entra se resolver algo que CSS não resolve — não por hábito.
- Exceção já aprovada: Lenis (~2kb) para smooth scroll.
- Só animar `transform` e `opacity`. Nunca `top`/`left`/`width`/`height`.
- Todo componente animado respeita `prefers-reduced-motion: reduce`.
- Zero valor mágico em componente: cor, spacing, duração e easing sempre via token.

### Não negociável

- O protótipo **não tem tratamento mobile**. Cada seção portada precisa de uma
  decisão explícita para 375px — não adapte no automático.
- A lista de projetos usa grid fixo `64px 1.6fr 1.4fr 84px`, que esmaga em telas
  estreitas. Reprojetar, não espremer.
- Hero: usar `100svh`, não `100vh` (barra fantasma no Safari iOS).
- `cursor: none` só quando o provider do cursor montar — nunca global no `body`.
- Navegação por teclado com foco visível em todos os interativos.
- i18n PT-BR/EN e alternância de tema continuam funcionando após cada mudança.

### Metas de performance

Baseline do site atual, medido com Lighthouse 13.4.1 em **mobile**
(`https://luismarceloportfolio.vercel.app` → redireciona para `/pt-BR`):

```
Performance 81 · Acessibilidade 96 · Best Practices 100 · SEO 100
FCP 1.1s · LCP 2.8s · TBT 560ms · CLS 0.005 · SI 3.0s · TTI 3.1s
```

O redesign precisa atingir, medido do mesmo jeito:

| Métrica | Piso (hoje) | Meta |
|---|---|---|
| Performance | 81 | **≥ 90** |
| Acessibilidade | 96 | **100** |
| Best Practices | 100 | manter 100 |
| SEO | 100 | manter 100 |
| TBT | 560 ms | **< 300 ms** |
| LCP | 2.8 s | **< 2.5 s** |
| CLS | 0.005 | **manter < 0.01** |

Diagnóstico do baseline — o gargalo é JavaScript, não imagem nem layout:

- Main thread ocupado 3.1s; execução de JS 2.4s. O TBT é o que derruba o score.
- Redirect `/` → `/pt-BR` custa ~800ms antes de qualquer render. Resolver ao
  mexer no i18n: renderizar na raiz ou negociar o locale sem hop extra.
- 37 KiB de JS não usado + 11 KiB de JS legado.
- Latência do documento: ~330ms. Render-blocking: ~110ms.
- Acessibilidade perde pontos em: links sem nome discernível e SVGs com
  `role="img"` sem texto alternativo (ícones de redes sociais).

**Risco novo introduzido pelo redesign:** cursor customizado, Lenis e o loop de
animação rodam na thread principal. Trocar 560ms de React por 560ms de animação
não é vitória. Todo trabalho de movimento deve ser verificado com CPU throttling
4x antes de considerar pronto.

### Conteúdo real (não inventar nomes)

Projetos: CONECI-RO · Estudante Auditor · Wiki.CGE · Gerenciador de Horários ·
3D Card Chaewon · Cat&Dog · Pokédex · Receitas do Mestre · Spacetime.
Localização: Porto Velho — RO. Atuação: Coordenador de Transparência Ativa na
CGE/RO e Engenheiro de Software Jr. na Biggelo (remoto, Node/NestJS).
