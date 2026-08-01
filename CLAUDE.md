# CLAUDE.md — portfólio Luís Marcelo

## Redesign em andamento: conceito "Dev Terminal"

`design/prototype.html` é a direção visual aprovada e a fonte da verdade.
Leia esse arquivo antes de qualquer decisão de espaçamento, escala ou timing.

### Tokens (em `src/styles/tokens.css`)

Escopados em `.theme-terminal`, **não em `:root`**. `globals.css` já define
`--muted` e `--accent` como triplas HSL do shadcn, consumidas via
`hsl(var(--muted))` pelo admin inteiro; redefinir esses nomes globalmente
produz `hsl(#828282)` — inválido — e quebra o painel.

O escuro é o default sem classe; o claro é o override `.light .theme-terminal`.
Nunca inverta essa orientação: existe uma janela em que o `<html>` fica sem
classe nenhuma (o `classList.remove` do next-themes roda antes do `add`), e
nela precisa cair no escuro, que é o `defaultTheme`.

```
escuro   --bg #0A0A0A   --surface #111111   --line #1F1F1F   --grid #151515
         --text #EDEDED --muted #828282     --accent #00E676

claro    --bg #EDEDED   --surface #FFFFFF   --line #D4D4D4   --grid #DCDCDC
         --text #0A0A0A --muted #636363     --accent #007A3D

--ease   cubic-bezier(0.16, 1, 0.3, 1)
```

Um único acento em todo o site. `[ok]` usa `--accent`, `[wip]` usa `--muted`.
Não existe cor de status separada — não invente uma.

#### Contrastes WCAG 2.1 — medidos, não estimados

Todo par abaixo foi calculado com a fórmula `(L1+0.05)/(L2+0.05)` sobre
luminância relativa sRGB. Ao mexer em qualquer cor, refaça a conta.

| Escuro | Ratio | | Claro | Ratio |
|---|---|---|---|---|
| `--text` / `--bg` | 16.91 | | `--text` / `--bg` | 16.91 |
| `--text` / `--surface` | 16.13 | | `--muted` / `--bg` | 5.13 |
| `--muted` / `--bg` | 5.15 | | `--muted` / `--surface` | 6.01 |
| `--muted` / `--surface` | 4.91 | | `--accent` / `--bg` | 4.66 |
| `--accent` / `--bg` | 11.86 | | `--accent` / `--surface` | 5.45 |
| `--accent` / `--surface` | 11.31 | | | |

**`--muted` é `#828282`, não o `#7A7A7A` do protótipo.** O valor original dá
4.61 sobre `--bg` mas **4.40 sobre `--surface`**, reprovando AA — e o label
`SESSION · STDIN`, de 11px em `--muted`, fica exatamente sobre `--surface`.
`#828282` sobe para 5.15 / 4.91 com desvio visual imperceptível.

**O acento claro não pode ser o verde da marca.** `#00E676` sobre `#EDEDED`
dá 1.6:1. Testados: `#00A15A` = 2.87 (reprova), `#008044` = 4.30 (reprova),
`#007A3D` = 4.66 (passa). `#007A3D` é o menor desvio que sobrevive.

`::selection` usa `background: var(--accent); color: var(--bg)` — o mesmo par
serve aos dois temas (11.86 no escuro, 4.66 no claro).

### Tipografia

JetBrains Mono via `next/font/local`. Carregar só os pesos usados: 300, 400, 500.

Os `.woff2` em `src/fonts` são **subsetados**, não os do release. O release
traz o charset inteiro a ~92 KiB por peso, e três pesos precarregados custaram
1s de LCP. Subset latin + latin-ext com `pyftsubset`, mantendo
`kern,liga,calt,ccmp,locl,mark,mkmk` — as ligaduras de código ficam, são a
assinatura da fonte. Resultado: ~22 KiB por peso, 428 glifos.

```
uvx --from fonttools --with brotli pyftsubset ORIGINAL.woff2 \
  --output-file=src/fonts/JetBrainsMono-<peso>.woff2 --flavor=woff2 \
  --unicodes="<latin>,<latin-ext>" \
  --layout-features="kern,liga,calt,ccmp,locl,mark,mkmk" \
  --no-hinting --desubroutinize
```

O `unicode-range` em `src/lib/fonts.ts` precisa espelhar o subset. Caractere
fora do range cai no fallback silenciosamente — refaça o subset, não troque a
fonte. O `next/font` exige literal escrito na chamada: nada de variável,
template ou concatenação no `declarations`.

**`preload: false` é deliberado.** Com `display: 'swap'` o texto pinta na hora
no fallback métrico, então o LCP não espera fonte. Com `preload: true` o
navegador baixa **todos** os pesos declarados, usados ou não — foi o que
gerou 274 KiB. Sem preload, ele busca só os pesos que algum texto casa.
O `preload` do next/font é por chamada e não por peso: precarregar só o 500
exigiria quebrar a família em duas e faria o navegador sintetizar peso.

Fonte só no lugar que a usa: a Sora vive em `(site)/[locale]/page.tsx`, não no
layout de locale, senão o /v2 baixaria 36 KiB de uma fonte que não desenha.

- Display do hero: `clamp(3.5rem, 13vw, 15rem)` · `-0.04em` · lh `0.9` · **peso 500**
- Nome de projeto: `clamp(1.3rem, 3.4vw, 2.9rem)` · `-0.035em` · lh `1` · peso 400
- Marquee: `clamp(1.4rem, 4vw, 3.4rem)` · `-0.03em` · peso 300
- Subtítulo do hero: `clamp(.8rem, 1.1vw, 1rem)` · tracking `.24em` · uppercase · peso 300
- Labels/meta: `11px` · tracking `.18em`–`.2em` · uppercase · cor `--muted`

### Espaço

- Gutter lateral: `clamp(20px, 3vw, 44px)`
- Seção padrão: `clamp(64px, 9vw, 140px)` vertical
- Seção de destaque: `clamp(70px, 11vw, 180px)` vertical
- Grid de fundo: 12 colunas, `border-left: 1px solid var(--grid)`, **sem opacity**.
  O protótipo usa `--line` a `opacity: .5`, mas `--line` também desenha bordas
  em opacidade cheia e as duas necessidades divergem. `--grid` já carrega a cor
  efetiva (`#151515` no escuro é exatamente `#1F1F1F` a 50% sobre `#0A0A0A`),
  o que tira o valor mágico do componente.

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

**Tailwind é 3.3.3, não 3.4.** `min-h-svh`, `min-h-<spacing>` e `min-w-<spacing>`
não existem nessa versão. Em vez de valor arbitrário no componente, os que
precisamos entraram em `theme.extend`: `min-h-svh`, `min-h-tap` / `min-w-tap`
(44px de alvo de toque). Precisou de um valor novo? Vira token no config.

As chaves de cor `muted` e `accent` do Tailwind **pertencem ao shadcn**. As do
redesign vivem no namespace `term`: `bg-term-bg`, `text-term-muted`,
`border-term-line`, `text-term-accent`. Nunca sobrescreva as do shadcn.

### Estrutura de rotas

Root layouts múltiplos via route groups — cada um com seu próprio `<html>`:

- `src/app/(site)/[locale]/layout.tsx` — `lang={locale}`, expõe `--font-mono`
- `src/app/(admin)/layout.tsx` — admin em Sora e shadcn, isolado dos tokens

`middleware.ts` **precisa ficar em `src/middleware.ts`**. Com um diretório
`src/` presente, o Next ignora silenciosamente o da raiz: o
`middleware-manifest.json` sai com `"middleware": {}` e nada acusa o erro.
Foi assim que ele passou o projeto inteiro sem nunca rodar.

`localePrefix: 'as-needed'` + `localeDetection: false`: pt-BR mora em `/` por
rewrite interno, en em `/en`, e `/pt-BR` redireciona uma vez para `/` — o
próprio next-intl faz isso, não existe regra em `next.config.js` e não deve
existir. Nenhuma URL, canonical, hreflang ou sitemap pode apontar para `/pt-BR`.

### Scroll — decidido, não negociável

O `<body>` é quem rola. Nenhum `h-screen` + `overflow-y-auto` em wrapper,
nenhum `scroll-snap`. O `HomeShell` antigo rola num `<div>` interno e é
justamente o padrão a não herdar: quebra o Lenis (que assume `window`) e o
IntersectionObserver com `root: null`.

Para conter overflow horizontal use `overflow-x: clip`, nunca `hidden` —
`hidden` transforma o elemento em contêiner de scroll e mata `position: sticky`
e o smooth scroll. O protótipo usa `hidden` em `html,body` por ser um arquivo
solto; não copie isso.

### Promoção do /v2 — um commit só

Quando as seções estiverem portadas:

1. `git mv src/app/(site)/[locale]/v2/page.tsx src/app/(site)/[locale]/page.tsx`
2. absorver o `v2/layout.tsx` no layout de locale (incluindo o wrapper
   `.theme-terminal`) e apagar o diretório `v2/`
3. trocar Sora por JetBrains Mono no `<body>` do layout de locale
4. deletar `home-shell.tsx`, `particles-background.tsx`, `loadingscreen.tsx`,
   `sidebar.tsx`, `sections/*` e `locale-switcher.tsx`
5. desinstalar `tsparticles`, `react-tsparticles`, `typewriter-effect`,
   `react-typewriter-effect` (os dois últimos já estão instalados sem uso)
6. remover `--term-doc-bg` de `tokens.css` — só existe porque o `<body>` ainda
   é pintado pelo shadcn enquanto o /v2 é staging

### Não negociável

- O protótipo **não tem tratamento mobile**. Cada seção portada precisa de uma
  decisão explícita para 375px — não adapte no automático.
- A lista de projetos usa grid fixo `64px 1.6fr 1.4fr 84px`, que esmaga em telas
  estreitas. Reprojetar, não espremer.
- Hero: usar `100svh`, não `100vh` (barra fantasma no Safari iOS).
- `cursor: none` só quando o provider do cursor montar — nunca global no `body`.
- Navegação por teclado com foco visível em todos os interativos.
- i18n PT-BR/EN e alternância de tema continuam funcionando após cada mudança.
- Colapso responsivo é sempre media query CSS, nunca renderização condicional
  em JS — evita hydration mismatch e layout shift.
- Controles interativos: `min-h-tap`/`min-w-tap` para o alvo de toque, estado
  fora da cor (`aria-current`, `aria-pressed`), e nunca comunicado só por glifo.

**Decisão do header a 375px:** `porto velho · ro` e `v.2026` somem no mobile;
ficam `LM — FULL-STACK` e os dois controles. Consequência registrada: a
localização passa a existir **só** no header desktop, então **a seção "sobre"
precisa carregá-la** — é requisito dela, não opcional.

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
- ~~Redirect `/` → `/pt-BR` custa ~800ms.~~ **RESOLVIDO.** E o diagnóstico
  original estava errado quanto à causa: não era hop de middleware — o
  middleware nunca rodou, por estar na raiz em vez de `src/`. Os ~800ms vinham
  do `redirect()` em `src/app/page.tsx`, um render de RSC mais round trip.
  Hoje `/` responde 200 com rewrite interno, zero hop.
- 37 KiB de JS não usado + 11 KiB de JS legado.
- Latência do documento: ~330ms. Render-blocking: ~110ms.
- Acessibilidade perde pontos em: links sem nome discernível e SVGs com
  `role="img"` sem texto alternativo (ícones de redes sociais).

### Piso medido da fundação (01/08/2026)

`/v2` com tokens, grid, header e footer — nenhuma seção de conteúdo ainda.
Build de produção local, Lighthouse 13.4.1 mobile:

```
Performance 99 · Acessibilidade 100
FCP 1.2s · LCP 2.2s · TBT 20ms · CLS 0.001 · SI 1.2s · 188 KiB
```

É contra este piso — não contra o baseline — que cada seção e cada camada de
movimento deve ser julgada. Orçamento disponível até estourar a meta:
**280ms de TBT** e **300ms de LCP**. Gastar tudo em uma única seção é sinal
de que algo foi feito errado.

Pendências conhecidas, nenhuma bloqueante:
- Render-blocking de CSS: ~590ms estimados. Reavaliar quando houver conteúdo.
- Legacy JavaScript: 12 KiB de polyfill. Ajustável via browserslist.

### Fonte: variável, medida (01/08/2026)

`src/fonts/JetBrainsMono-Variable.woff2`, eixo `wght` instanciado em 300–500,
subset latin + latin-ext, `liga`/`calt` preservados: **38,8 KiB** no lugar de
68 KiB em três arquivos estáticos. Três requisições viraram uma.

Em `next/font/local` é **uma** entrada em `src` com `weight: "300 500"` — nunca
três entradas apontando para o mesmo arquivo. `preload: false` e
`display: swap` continuam valendo pelos motivos já registrados.

### Hero — medido (01/08/2026)

```
Performance 99 · Acessibilidade 100
FCP 1.21s · LCP 2.153s · TBT 0ms · CLS 0.000
```

Contra o piso da fundação (LCP 2.2s), o hero custou praticamente zero. O
orçamento de 280ms de TBT e 300ms de LCP segue intacto para as próximas seções.

### Decisão revista: header em 375px

A regra anterior — manter `LM — FULL-STACK` e os dois controles em 375px — era
inviável: pedia 381px contra 335 de linha útil. Vale esta:

- Em `<768px` a identidade encolhe para `LM`. O sufixo `— full-stack` é
  redundante com o subtítulo do hero, que fica logo abaixo em escala muito
  maior, e o header não é fixo (vive dentro do hero), então os dois são sempre
  co-visíveis.
- Os dois controles mantêm **ambos os estados visíveis**, com `aria-pressed` e
  `aria-current`. Mostrar só a alternativa tornaria `[en]` ambíguo — estado
  atual ou ação? — e desfaria a correção que levou a acessibilidade a 100.

**Risco novo introduzido pelo redesign:** cursor customizado, Lenis e o loop de
animação rodam na thread principal. Trocar 560ms de React por 560ms de animação
não é vitória. Todo trabalho de movimento deve ser verificado com CPU throttling
4x antes de considerar pronto.

### Conteúdo real (não inventar nomes)

Projetos: CONECI-RO · Estudante Auditor · Wiki.CGE · Gerenciador de Horários ·
3D Card Chaewon · Cat&Dog · Pokédex · Receitas do Mestre · Spacetime.
Localização: Porto Velho — RO. Atuação: Coordenador de Transparência Ativa na
CGE/RO e Engenheiro de Software Jr. na Biggelo (remoto, Node/NestJS).
