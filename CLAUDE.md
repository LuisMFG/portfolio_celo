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

#### Régua marca troca de superfície, não fronteira de seção

**Linha (`--line`) marca mudança de superfície, não fronteira de seção.** Ela
aparece no topo/base do marquee e no topo da seção de comando porque as duas
trocam o fundo para `--surface`, e nas bordas da lista de projetos porque a
lista é uma tabela. Entre seções que compartilham o mesmo `--bg`, o separador é
o espaço vertical (`clamp(64px, 9vw, 140px)`) — o vão generoso é intencional,
não ausência de acabamento.

Vale para as três seções derivadas que ainda faltam (stack, experiência,
contato) e é o que decide, sozinho, se cada uma leva régua: a pergunta não é
"onde acaba a seção anterior", é "esta seção troca de fundo?". Se não troca,
não leva. O impulso a corrigir é justamente o de quem vê 280px de vão e lê
falta de acabamento — foi o que aconteceu entre "sobre" e "projetos", e a
resposta foi manter.

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

**O `twMerge` apaga a escala tipográfica em silêncio.** O `cn()` de
`src/lib/utils.ts` passa por `tailwind-merge`, que decide se um `text-*` é
tamanho ou cor pelo formato do sufixo: `text-2xl` casa com t-shirt size e cai
no grupo `font-size`; `text-command`, `text-display`, `text-project` e os
outros do protótipo não casam com nada e caem no grupo `text-color`. Aí
`cn("text-command", "text-term-text")` vê duas cores no mesmo grupo, mantém a
última e **descarta o tamanho**. A linha digitada renderizou a 16px em vez de
41.6px por causa disso, e build, type-check e lint passaram os três.

A correção está em `src/lib/utils.ts`: `extendTailwindMerge` com a lista de
chaves de `theme.extend.fontSize`. **Chave nova em `fontSize` entra nas duas
listas.** O sintoma de esquecer é texto no tamanho errado, e só onde `cn`
recebe cor e tamanho na mesma chamada — `terminal-prompt.tsx` já tinha a
armadilha armada sem disparar.

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

### Promoção do /v2 — feita (09/09/2026)

Os seis passos registrados, executados em um commit só. `/` responde 200 por
rewrite, `/pt-BR` 307 → `/` (um hop exato), `/en` 200, `/v2` 404. First Load
da home: **236 kB → 133 kB**.

Duas coisas saíram diferente do que o roteiro previa, e as duas são decisão:

**`.theme-terminal` foi para o `<body>`, não para um wrapper.** O passo 6
mandava remover `--term-doc-bg`, mas aquele token existia por uma razão
estrutural que a promoção sozinha não resolvia: `--bg` vive dentro de
`.theme-terminal` e o `<body>` ficava fora dele. Subir a classe para o
`<body>` é o que de fato mata o token — `background-color: var(--bg)` já é
regra de `.theme-terminal`, e as duas cores deixam de ter segunda cópia.
Medido nos dois temas: `body` em `#0a0a0a` / `#ededed`, mono aplicada.

O `<div>` interno continua existindo com `relative min-h-svh
[overflow-x:clip]`, e **isso não é redundância**: `overflow-x` no `<body>`
propaga para o viewport. Verificado que `body { overflow-x }` computa
`visible` e `scrollWidth == innerWidth`.

**A desinstalação precisou de `--legacy-peer-deps`.** O projeto tem um
conflito de peer deps **pré-existente e latente**: `cmdk@1.0.0` pede React 18
e o projeto usa React 19. Sem a flag, `npm uninstall` aborta com ERESOLVE — e
não tem nada a ver com os pacotes removidos.

Não existe `.npmrc` nem `vercel.json` no repositório: **a build de produção
funciona porque a Vercel cai sozinha para `--legacy-peer-deps` ao detectar
ERESOLVE.** Isso é dependência de um comportamento implícito da plataforma, e
qualquer `npm install` local sem a flag falha. Registrado como dívida, não
resolvido aqui — a correção é subir `cmdk` ou fixar a política num `.npmrc`,
e as duas mexem em resolução de dependência, que não é assunto de promoção.

O diff do lock foi conferido antes de aceitar, e é **puramente subtrativo**:
366 pacotes removidos, **0 adicionados, 0 mudanças de versão**. Os 319 que não
são os quatro nomeados são a árvore transitiva deles (o `typewriter-effect`
arrastava uma cadeia velha de webpack).

#### Plano de rollback

`git revert` do commit de promoção devolve a home antiga **inteira**: o commit
inclui `package.json` e `package-lock.json`, então os pacotes voltam junto e o
build seguinte (`npm ci`) os reinstala. Nenhuma migration entra aqui — não há
estado de banco para desfazer.

**Mas revert não é o primeiro movimento.** Se algo quebrar em produção, o
caminho é o **Instant Rollback da Vercel** — repromover o deployment anterior.
Segundos, sem git, sem build. O revert vem depois, com calma.

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

#### VEREDITO — medido em produção (09/09/2026)

Redesign no ar, `/` em `luismarceloportfolio.vercel.app`, mesma rota e mesmo
cache do baseline. Quatro execuções, a primeira descartada:

```
Performance 99 · Acessibilidade 100 · Best Practices 100 · SEO 100
FCP 1.07–1.48s · LCP 1.82–1.98s · TBT 22–80ms · CLS 0.000 · SI 2.50–2.67s
doc 13.417 B (estável, abaixo do limiar de 14.600)
```

| Métrica | Baseline | Meta | Produção | |
|---|---|---|---|---|
| Performance | 81 | ≥ 90 | **99** | ✓ |
| Acessibilidade | 96 | 100 | **100** | ✓ |
| Best Practices | 100 | manter | **100** | ✓ |
| SEO | 100 | manter | **100** | ✓ |
| TBT | 560 ms | < 300 ms | **22–80 ms** | ✓ |
| LCP | 2.8 s | < 2.5 s | **~1.9 s** | ✓ |
| CLS | 0.005 | < 0.01 | **0.000** | ✓ |

**Todas as metas batidas.** O LCP entrou com quase 600ms de folga, não na
borda — e isso vale como correção de tudo que se mediu no localhost: as
séries de 2,3s e 2,5s eram do simulador, não do site. First Load da home:
236 kB → 133 kB.

O gargalo diagnosticado no baseline era JavaScript, e é onde está o ganho: o
TBT caiu de 560ms para dezenas. Sobrou espaço real para a fase de movimento —
**mas o orçamento agora se mede contra estes números, não contra os de
localhost.**

#### Estes números são de produção. As medições de seção não são.

**A tabela acima foi medida no site publicado na Vercel, atrás de CDN. O piso
de 2,2s e todas as medições de seção são `next start` em localhost com o
simulador Lantern do Lighthouse. Os dois não são comparáveis em valor
absoluto.**

A distinção não é acadêmica, e é a que faltava aqui:

- **Delta entre medições localhost é comparável** — mesma máquina, mesmo
  simulador, mesmo build. "Esta seção custou +100ms de LCP" é uma afirmação
  válida, e é assim que cada seção foi julgada.
- **Limiar absoluto entre ambientes diferentes, não.** Dizer "LCP 2,5s
  estourou a meta de < 2,5s" compara maçã localhost com laranja produção. A
  latência de documento, o TLS, o cache de borda e a distribuição geográfica
  do CDN não existem no localhost, e o Lantern os substitui por um modelo
  fixo de 150ms de RTT.

**Nenhuma cirurgia de CSS crítico deve começar antes de o LCP ser medido no
deploy real.** Sem isso não se sabe contra o que se está otimizando: o
localhost pode estar mentindo para os dois lados, e o custo de otimizar a
métrica errada é alto.

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

### Marquee — medido (01/08/2026)

```
Performance 99 · Acessibilidade 100
FCP 1.2s · LCP 2.2s · TBT 0ms · CLS 0.000 · SI 1.2s · 207 KiB
```

Zero JS: o loop é `@keyframes` e a freada do hover é um `:hover` atrás de
`@media (hover: hover)` — em toque o `:hover` gruda depois do tap e a faixa
ficaria lenta para sempre. O orçamento de 280ms de TBT e 300ms de LCP segue
intacto.

A faixa lista **12 tecnologias**, não as 10 do protótipo: `technologies.tsx`
tem 11 e o protótipo tem 10, e a interseção não é total nos dois sentidos —
o protótipo acrescenta NestJS (real, está na descrição do cargo na Biggelo) e
larga Tailwind e Git. Redesign é visual, então nada de conteúdo se perde.

#### Os 28s do marquee são velocidade, não duração

**28s equivalem ao trilho do protótipo. Trilhos de outra largura precisam
recalcular a duração para manter os mesmos px/s.** Ler 28s como valor absoluto
é o erro — quem acrescentar ou tirar uma tecnologia muda a velocidade da faixa
sem tocar em nenhum número de movimento.

```
protótipo   2908,09px por cópia a 1440px ÷ 28s   = 103,86 px/s
aqui        3409,09px por cópia a 1440px ÷ 103,86 = 32,82s
```

A razão 1,1723 não depende do viewport: fonte, tracking e o padding do
separador são todos em `em`, então as duas larguras escalam pelo mesmo
`clamp()` e uma única constante serve para toda tela. O hover continua sendo
duração ÷ 0.6 → 54,7s.

A largura maior foi **medida antes de compensar**, e a diferença é só de
conteúdo, não de espaçamento: os 10 itens compartilhados medem igual ao
protótipo sub-pixel a sub-pixel (`TYPESCRIPT` 310,08 nos dois, separador 79,95
nos dois, padding 24,48px = 0,45em nos dois), somando 2908,09 dos dois lados
com delta 0,00. Os 501px de diferença são exatamente `TAILWIND` (328,02) mais
`GIT` (172,98). De quebra isso prova que a variável subsetada tem os mesmos
avanços das estáticas do release. Compensar duração sem essa medição teria
escondido um erro de espaçamento atrás de um marquee com aparência correta.

`lineHeight: normal` no token `marquee` **não é decoração**: o preflight do
Tailwind põe `line-height: 1.5` no `html`, herdado até a faixa, e 1.5 × 54.4px
engordava a banda em 10,6px. Com o token explícito a banda mede 141px a
1440px — o número exato do protótipo.

Um `<section>` com nome acessível é landmark `region`, e a faixa vive fora do
`<main>` (que mora dentro do shell `min-h-svh` para dividir a coluna flex com o
header, e o header precisa ficar fora do `<main>` para ser `banner`). **Toda
seção que entrar abaixo do hero precisa de nome acessível — ou de sair da
árvore.**

**A faixa saiu da árvore, e isso reverte a decisão original.** Ela nasceu com
`aria-label` porque era a única portadora da lista de tecnologias. Quando a
seção "stack" passou a listar as mesmas doze, o `aria-label` virou defeito:
doze itens duplicados na árvore e duas `region` com o nome "Tecnologias",
indistinguíveis numa lista de landmarks. Hoje a faixa inteira é
`aria-hidden="true"` — textura, não informação.

`aria-hidden` sobre texto visível só é legítimo enquanto a cobertura for total,
e a condição é **verificada, não suposta**: `STACK_COVERS_MARQUEE`, em
`src/lib/stack.ts`, quebra o build se um dos lados ganhar tecnologia que o
outro não tem. A faixa também não tem elemento focável, que é o outro
requisito.

Sem movimento (`prefers-reduced-motion`) a faixa vira texto corrido: trilho
solta o `max-content`, a lista quebra linha dentro do gutter, a cópia-eco e o
separador final somem. Marquee parado esconderia a maior parte da lista atrás
da borda.

O argumento original — "informação que só existe enquanto algo se move não é
informação" — perdeu metade da força quando a seção "stack" passou a carregar
a lista: hoje nada de fato se perde. **O reflow fica assim mesmo**, porque a
outra metade continua de pé: faixa parada e cortada no meio de uma palavra
parece defeito de render, e defeito aparente é o que o usuário reporta.

### Comando — medido (30/08/2026)

```
Performance 99 · Acessibilidade 100
FCP 1.2s · LCP 2.2s · TBT 0ms · CLS 0.000 · SI 1.2s · 210 KiB
```

Três execuções idênticas — a primeira medição deu 98/LCP 2.3s e era ruído.

**É o primeiro JavaScript de cliente do redesign, e o TBT não se mexeu: 0ms
antes da seção, 0ms depois.** A rota saiu de 3,57 KiB para 3,65 KiB. Digitar
36 caracteres com `setTimeout` mais um IntersectionObserver custa zero de
bloqueio: o trabalho por caractere é um `setState` de um inteiro e a árvore
reconciliada tem três nós.

**Ressalva, e ela é a parte importante do número:** o TBT de 0ms mede trabalho
esparso (`setTimeout` a 28ms), não um loop por quadro. O orçamento de 280ms
segue intacto mas **ainda não foi testado contra `rAF` contínuo** — o custo do
cursor, do Lenis e do marquee em JS não pode ser inferido deste número. O
risco registrado da fase de movimento continua de pé e continua exigindo
verificação com CPU throttling 4x.

#### A digitação não pode custar CLS

O texto ainda não digitado **fica no DOM**, transparente, no lugar exato onde
vai aparecer. Sem isso a linha cresceria de zero à largura final e, a 375px,
ganharia uma segunda linha no meio da digitação — CLS puro num piso de 0.001.
`opacity`, não `visibility` nem `display`: as outras duas tirariam o texto da
árvore de acessibilidade e devolveriam o reflow que o fantasma existe para
evitar. Medido: altura idêntica antes e depois da digitação em 320, 360, 375,
390, 414, 768 e 1440px.

Manter o resto no DOM também é o que faz o leitor de tela encontrar
`~/luis-marcelo $ ls ./projects --all` inteiro e em ordem em qualquer instante
da animação. Nada de `aria-live` — o texto não é anúncio, e mutação fora de
live region não é narrada.

O primeiro render do cliente é **idêntico** ao do servidor (string completa);
a truncagem só acontece dentro do `useEffect`. É a mesma armadilha do guard
`mounted` do controle de tema. De quebra, é o comportamento correto sem JS e
sob `prefers-reduced-motion`, que saem pela mesma porta — verificado no
emulador do DevTools, não por leitura do código.

#### `--caret-reserve` — por que existe

O cursor é absoluto e por isso não conta na quebra de linha. Medido a 375px:
**o texto cabe por 6,7px** (328,3px contra 335px de linha útil), **mas o
cursor pintava 4px dentro do gutter** de 20px — sem gerar scroll horizontal,
e ainda assim atravessando uma regra dura do projeto.

`--caret-reserve` (`--caret-gap` + `--caret-width`) devolve esse espaço como
`padding-right` da linha. **É padding constante, não um clamp rebaixado** —
baixar o piso para ~0.98rem seria valor mágico escondendo sintoma. Constante
também significa que a reserva não depende de onde o cursor está, e por isso
não reintroduz o reflow que a posição absoluta existe para evitar.

Consequência: a 375px a linha passa a quebrar em duas. Abaixo de 368px de
viewport o texto sozinho já não caberia e a quebra aconteceria de qualquer
forma.

#### Decisão: o corte de linha cai depois do hífen

**A linha do comando quebra depois do hífen, em `--` / `all`, e não antes do
token. Isso é intencional:** terminal quebra por coluna, não por palavra, e o
corte cai a 33 de ~35 caracteres, praticamente na coluna.

A alternativa (`nowrap` por token) foi testada e descartada: resolve o
cosmético e cria um modo de falha pior, com token longo estourando a linha sem
fallback. `word-break: keep-all` e `overflow-wrap` não suprimem a quebra após
hífen em nenhuma combinação.

Isto está escrito como decisão, e não como pendência, de propósito. **Decisão
deliberada de não-consertar é a que mais some: bug documentado alguém acha,
escolha não documentada alguém desfaz.**

#### Quatro divergências do protótipo, e o motivo de cada uma

- **Cursor absoluto**, não `inline-block` como em `:143`. Um átomo inline
  entre o trecho digitado e o resto acrescenta largura e cria oportunidade de
  quebra no meio de uma palavra; como ele caminha um caractere por vez, a
  linha passaria a quebrar em pontos diferentes ao longo da digitação. A
  âncora inline vazia não ocupa largura nem cria ponto de quebra, então o
  texto quebra em todo quadro onde a string completa quebraria.
- **Texto não digitado transparente no DOM.** Segura a caixa (zero CLS) e
  entrega a linha inteira ao leitor de tela em qualquer instante da animação.
- **Rótulo como `<h2>`**, não `<div>` como em `:141`. Nomeia a `region`, já
  que a seção vive fora do `<main>` — mesmo requisito estrutural do marquee e
  da lista de projetos.
- **IntersectionObserver na linha, não na seção** (`:207` observa a seção). A
  seção tem `py-section-lg` dos dois lados e 35% da área dela já estão
  visíveis antes de o texto chegar perto do fundo da tela; observar a linha
  faz a digitação começar quando ela é de fato vista.

#### `TypedCommand` nasce genérico

Recebe a linha pronta por prop e não sabe nada sobre a seção que o usa. As
quatro seções derivadas (sobre, stack, experiência, contato) reaproveitam o
mesmo componente mudando só o `text` — fazer específico agora custaria quatro
refactors depois.

O caminho da sessão vem de `HeroSection.prompt.path`, não de uma cópia em
`CommandSection`: é o mesmo `~/luis-marcelo` do prompt do hero, a mesma
sessão, e duas cópias divergiriam na primeira edição de um lado só. Rótulo e
comando são jargão de terminal e têm o mesmo valor em PT e EN, como o
`exit 0` do rodapé — a seção é a primeira que renderiza idêntica nos dois
idiomas, e isso é intencional, não chave faltando.

### Sobre — medido (08/09/2026)

```
Performance 99 · Acessibilidade 100
FCP 1.2s · LCP 2.2s · TBT 0ms · CLS 0.000 · SI 1.2s · 211 KiB
```

Rota de 3,65 KiB para 3,65 KiB — server component puro, zero JS acrescentado.
Orçamento de 280ms de TBT e 300ms de LCP segue intacto.

**Ela não existe no protótipo.** Foi derivada, e o que ela precisou inventar
foi uma coisa só: **escala de leitura**. O maior texto não-display do protótipo
é o prompt do hero — assinatura de rodapé de tela, não corpo de sessenta
palavras. Todo o resto é empréstimo declarado:

- cabeçalho de dois rótulos de 11px `.2em` e o vão de `pb-projects-head`, da
  lista de projetos (`:101`)
- **sem régua sob o cabeçalho**, da seção comando (`:141`): régua ali fecha um
  `<ol>`, e isto é prosa. A única régua da seção separa prosa de dado, no fim
- fundo `--bg`, e por consequência **sem `border-top`**: o marquee logo acima é
  `--surface` e a borda de baixo dele já faz o corte. Duas faixas de superfície
  coladas apagariam a banda

O `whoami` do rótulo direito vem de `HeroSection.prompt.command`, não de uma
cópia — a seção é literalmente a resposta ao comando do hero, mesma decisão do
`prompt.path` reaproveitado pela `CommandSection`.

Zero chave nova em `messages/*.json`. A localização entra como `<dl>`, com o
rótulo de `ContactSection.location` (traduzido de verdade) e o valor de
`Header.location` — a mesma string que o header desenha. É requisito registrado
da seção, não enfeite: abaixo de 768px o header a esconde.

#### A medida é em `ch`, e é isso que dispensa media query no mobile

`ch` em monoespaçada é literalmente coluna. 72 é a largura de wrap convencional
de terminal e cai dentro do teto de 75 caracteres de legibilidade. Medido a
1440px: prosa de **829,44px = 72,0ch exatos**. A 375px a coluna útil é 335px, a
medida não morde e a prosa ocupa a linha inteira — **38,8 colunas**, sem uma
linha de CSS condicional.

O vão entre parágrafos é **uma linha em branco, não meia**: prosa em terminal
separa blocos assim. `--about-para-gap` deriva de `--body-leading` em vez de
repetir 1.65, e o `lineHeight` do token `body` no Tailwind lê a mesma variável —
mesma razão do `spacing.gutter`. Medido: vão de 31,67px contra entrelinha de
31,68px a 1440px, e 23,75 contra 23,76 a 375px.

#### 375px: nenhum colapso estrutural, e isso foi medido

Diferente da lista de projetos, não há grid para reprojetar — é uma coluna de
prosa. Contra os 335px de linha útil, medido nos dois idiomas:

| Par | PT | EN | Cabe |
|---|---|---|---|
| `SOBRE MIM` + `$ WHOAMI` | 79,20 + 70,42 + 16 | 70,41 + 70,42 + 16 | ✓ |
| `LOCALIZAÇÃO` + `PORTO VELHO · RO` | 96,81 + 140,81 + 16 | 70,41 + 140,81 + 16 | ✓ |

`headWraps` e `dlWraps` falsos nos quatro casos, `scrollWidth == innerWidth`.
O `flex-wrap` dos dois pares é rede, não layout — nas larguras onde tudo cabe
ele nunca dispara.

#### Nenhuma entrada animada, de propósito

Mesma regra da lista de projetos: o protótipo só anima o hero, e entrada por
scroll pede IntersectionObserver, que é a fase de movimento. Por isso a seção é
server component sem uma linha de cliente.

#### Decidido: sem régua entre "sobre" e "projetos"

Duas seções `--bg` vizinhas, cada uma com `py-section`, somam até **280px** — o
maior vão da página, e ele fica. Nenhuma das duas troca de fundo, então nenhuma
leva régua: é a aplicação direta de "régua marca troca de superfície, não
fronteira de seção", registrada em **Espaço**. O vão generoso é o separador.

O que enganava era comparar com projetos → comando, que tem `border-top` — mas
lá a régua existe porque o comando vira `--surface`, não porque uma seção
terminou.

#### Armadilha de medição: cache ISR entre builds

A primeira medição serviu uma página **anterior às seções de projetos e
comando** — `x-nextjs-cache: HIT` numa entrada prerenderizada que sobreviveu em
`.next/cache` de um build passado (a rota tem `revalidate: 3600`). Nada no
build acusa, e o HTML tem os textos novos embutidos no payload RSC, então
`grep` por conteúdo passa mesmo com o DOM velho.

**Medir `/v2` exige `rm -rf .next` antes do build**, ou conferir
`x-nextjs-cache` na resposta. Conferir por `id=` de landmark, e não por texto,
porque o payload RSC mente.

### Stack — medido (08/09/2026)

```
Performance 99 · Acessibilidade 100
FCP 1.2s · LCP 2.2s · TBT 0ms · CLS 0.000 · SI 1.2s · 212 KiB
```

Rota parada em 3,65 KiB. Server component, zero JS.

**O conteúdo desta seção já estava na página inteiro — o marquee lista as
mesmas doze.** Não existe dado de stack que a página não mostrasse. O que a
seção acrescenta é a única coisa que uma faixa em movimento não consegue:
**estrutura**. O agrupamento por domínio já existia implícito na ordem da faixa
(o docblock dela dizia em voz alta que "Tailwind fecha a corrida de front-end")
e aqui virou informação visível.

O preço foi duplicar doze nomes na tela, e a contrapartida foi tirar a faixa da
árvore de acessibilidade — está registrado acima, na seção do marquee.

#### Categoria, e só categoria

**Nada de nível de proficiência.** Esse dado não existe no banco nem no
`technologies.tsx`, e escala de senioridade inventada é a coisa mais fácil de
um recrutador desmentir. Os rótulos `./frontend`, `./backend` e `./infra` são
jargão de terminal e valem igual em PT e EN, pelo mesmo precedente do `exit 0`
— nenhuma chave nova em `messages/*.json`.

#### `src/lib/stack.ts` guarda duas ordens, e a segunda quebra o build

A lista vivia dentro de `marquee-section.tsx`. Com duas telas consumindo-a,
duas cópias divergiriam na primeira edição de um lado só.

**As duas ordens são diferentes e as duas são intencionais.** A faixa segue a
do protótipo (`:95`), que não é agrupada — back-end abre com Node.js/NestJS,
front-end vem no meio e .NET/Spring voltam depois. Derivar a ordem da faixa dos
grupos reordenaria a faixa, então `MARQUEE_ORDER` é lista própria.

O risco disso é uma ganhar item que a outra não tem, e `STACK_COVERS_MARQUEE`
transforma esse risco em erro de type-check por igualdade de conjuntos:

```ts
type Exact<A, B> = [A] extends [B] ? ([B] extends [A] ? true : never) : never;
export const STACK_COVERS_MARQUEE: Exact<GroupedTechnology, MarqueeTechnology> = true;
```

**Guarda foi vista falhando antes de ser aceita.** Tirando `Git` do grupo
`infra` e deixando na faixa: `stack.ts(77,14): error TS2322: Type 'boolean' is
not assignable to type 'never'`. Guarda que ninguém viu falhar não é guarda —
é a lista do `twMerge` em `src/lib/utils.ts`, que depende de alguém lembrar.

#### Procedência dos doze, conferida contra o código

Não de memória. Diferenças de conjunto, calculadas:

| Comparação | Resultado |
|---|---|
| marquee − agrupada | nenhum |
| agrupada − marquee | nenhum |
| `technologies.tsx` − agrupada | nenhum |
| agrupada − `technologies.tsx` | `NestJS` |
| duplicado entre grupos | nenhum |

`NestJS` é a única diferença e não é invenção: veio do protótipo, e a origem
real já estava registrada — descrição do cargo na Biggelo, em `messages/*.json`.

#### A coluna de rótulos é `max-content`, não um px medido a olho

Acima de `md`, `display: contents` dissolve o `<div>` de agrupamento e as seis
células viram itens diretos de um grid só. **É isso que alinha a coluna entre os
três grupos sem largura fixa** — um grid por grupo não compartilharia coluna, e
a alternativa seria cravar um número. Medido a 1440px: os três `<dt>` com
81,41px idênticos, as três listas começando em 140,60px.

Os dois vãos são apelidos, não números novos: `--stack-row-gap` é
`--project-pad-y` (o respiro de uma linha de projeto, aqui como `row-gap`
porque não há borda para o padding encostar) e `--stack-label-gap` é
`--project-row-gap` (que só existe abaixo de `md`, exatamente esta situação).

#### 375px: o rótulo sobe, a lista ocupa a linha inteira

Lado a lado, `./frontend` come 81px dos 335px úteis e a coluna restante não
sustenta a lista — `TYPESCRIPT` sozinho mede 86px no piso da escala. Medido a
375px: os três grupos empilhados, listas de 20px a 355px, `./frontend` em duas
linhas e os outros dois em uma, vão rótulo→lista de 12px, `scrollWidth` igual a
`innerWidth`, cabeçalho sem quebra (96,80 + 96,80 + 16 = 209,6 de 335).

#### Rótulos alinhados à esquerda, não à direita

A coluna deixa vão maior depois de `./infra` que depois de `./frontend`.
Alinhar à direita fecharia o vão, e foi descartado: saída de terminal alinha
coluna à esquerda, e a lista de projetos faz o mesmo com o índice. **Decisão,
não descuido** — é o tipo de irregularidade que alguém "conserta" sem saber que
foi escolhida.

### Experiência — medido (09/09/2026)

```
Performance 99 · Acessibilidade 100
FCP 1.2s · LCP 2.2s · TBT 0ms · CLS 0.000 · SI 1.2s · 214 KiB
```

Rota parada em 3,65 KiB. Server component, zero JS. Orçamento de 280ms de TBT
e 300ms de LCP segue intacto — é a quarta seção seguida que não custa nada,
porque nenhuma delas tem cliente.

**Não existe no protótipo.** Derivada, e diferente de "sobre" ela não precisou
inventar escala nenhuma: a hierarquia é **cor**, não tamanho. Cargo e
descrição dividem o mesmo `text-body` e se separam por `--text` contra
`--muted` — comando aceso, saída apagada. Período e empresa são
`text-project-meta`, os mesmos 11px `.14em` do índice e da pilha da linha de
projeto. Empréstimos: cabeçalho de dois rótulos com `pb-projects-head` e
contador derivado do tamanho da lista (`006 / log`), da lista de projetos; grid
`max-content minmax(0,1fr)` com `--project-gap` e `align-items: baseline`, da
seção "stack"; fundo `--bg` e por isso **sem `border-top`**.

Zero chave nova em `messages/*.json`: `ExperienceSection.title`,
`.professional` e `.academic` já existiam traduzidas e são exatamente os três
rótulos necessários. `log` é jargão de terminal, como `stack` e `exit 0`.

#### Sem régua entre entradas, e o vão é uma família de linhas em branco

Régua marca troca de superfície; e mesmo dentro da seção, a lista de projetos
tem régua porque é tabela — isto é prosa em blocos, que "sobre" já decidiu
separar por espaço. Régua aqui desenharia uma segunda tabela competindo com a
lista de projetos.

Todos os vãos derivam de `--about-para-gap`, nenhum clamp novo. Medido a
1440px, contra uma linha de 31,68px:

```
cargo → empresa        12px      (--project-row-gap)
cabeçalho → descrição  31,68px   1 linha
entrada → entrada      63,36px   2 linhas
grupo → grupo          95,04px   3 linhas
```

`--exp-measure` é apelido de `--about-measure`: a descrição mede **829,44px =
72,0ch exatos**, o mesmo número da prosa de "sobre". Mesmo tipo de texto,
mesma largura de leitura.

#### `--exp-head-gap` existe porque dois rótulos de 11px seguidos colidem

Sem ele, "EXPERIÊNCIAS" e "PROFISSIONAL" ficam com 22px acima e 22px abaixo —
simétricos — e como os dois são 11px em `--muted`, o rótulo do grupo se lê como
subtítulo da seção, não como cabeçalho da lista dele. Nas outras seções
`pb-projects-head` separa rótulo de *conteúdo*; aqui o conteúdo começa com
outro rótulo. Uma linha em branco resolve: 70,2px acima contra 50,2px abaixo,
e o rótulo passa a se ligar para baixo. **Só o primeiro grupo precisa** — o
segundo já tem três linhas de `--exp-group-gap` acima.

#### `subgrid`, e não `display: contents`

A trilha de períodos só alinha se todas as entradas dividirem o mesmo grid; um
grid por `<li>` daria um `max-content` diferente para cada uma. O caminho curto
seria `display: contents` no `<li>`, como a seção "stack" faz no `<div>` de
agrupamento — mas lá o elemento dissolvido não tem semântica a perder, e aqui
ele é item de lista. Este projeto **já foi mordido** por perda de semântica de
lista via CSS: é por isso que a "stack" carrega `role="list"` explícito.

Com `subgrid` o `<li>` continua gerando caixa e nada na árvore de
acessibilidade é tocado. O `@supports` não é enfeite: onde subgrid não existe
cai-se no empilhado, que é o layout do mobile — **degradação para um estado
projetado, não para um quebrado**.

#### A trilha alinha por grupo, não entre grupos — e isso é dado, não CSS

Cada `<ol>` é um grid próprio. Medido: as duas trilhas coincidem nos dois
idiomas (203,5px em PT, 154,7px em EN) porque o período mais longo tem o mesmo
número de caracteres dos dois lados — 25 em PT, 19 em EN. **Propriedade dos
dados, não da folha de estilo:** um período editado no admin pode desalinhar.

Fica assim. Unificar exigiria subgrid aninhado em três níveis para ganhar
alinhamento entre blocos já separados por três linhas em branco e um rótulo.
Registrado porque é diferença que alguém vê depois e lê como bug.

#### A partição por tipo é total, de propósito

`Experience.type` é `String` livre no schema, não enum — mesma armadilha de
`Project.status`, e `content.ts` faz `r.type as "professional" | "academic"`
sem guard. Dois filtros por igualdade descartariam em silêncio qualquer valor
fora da lista e uma entrada publicada sumiria da página sem nada acusar. O
desconhecido cai em `professional`, o mesmo default que `content.ts` já usa.

**A trilha acadêmica sai da mesma consulta:** `fetchExperiences` filtra só por
`isPublished`, sem `where` por tipo. Verificado no DOM servido — IFRO e IFAM
presentes, 6 entradas em 2 grupos (4 + 2).

A ordem dos grupos é array explícito no componente, não ordem de chegada: o
banco ordena por `type: "asc"` e `"academic"` vem antes de `"professional"` no
alfabeto, então na ordem do banco a formação abriria a seção.

#### Três ornamentos recusados

- **Hash curto de commit** (`a3f9c21`) ao lado do cargo, à la `git log
  --oneline`. Fica fora **mesmo derivado deterministicamente do conteúdo**: o
  problema não é o sorteio — que quebraria a hidratação por divergir entre
  servidor e cliente — é que o glifo finge endereçar um commit inexistente.
  Não há repositório onde "Coordenador de Transparência Ativa" seja um objeto.
- **`[atual]`** nas posições em curso, na gramática de colchetes do protótipo.
  Exigiria copy nova e inferir "em andamento" procurando `"Presente"`/
  `"Present"` numa string livre e traduzida — a armadilha que `toProjectStatus`
  existe para fechar. O período já diz "Presente".
- **Nível de proficiência ou senioridade**, pela mesma razão registrada em
  `stack.ts`.

#### 375px: o período sobe, a entrada ocupa a linha inteira

Mesmo colapso e mesmo breakpoint (`md`) da "stack". Lado a lado, `ABR DE 2025 -
NOV DE 2025` come ~204px dos 335px úteis e a coluna restante não sustenta cargo
nem descrição. Medido a 375px: entrada empilhada em 335px, período em uma linha,
descrição em 38,8 colunas, `scrollWidth == innerWidth`, cabeçalho sem quebra
(105,6 + 79,2 + 16 = 200,8 de 335). Empresa quebra em duas linhas — é meta,
mesma tolerância da pilha de tecnologias na linha de projeto.

#### Armadilha de medição, de novo — e desta vez não era o ISR

Uma correção de CSS não apareceu no navegador por três tentativas. O cache ISR
levou a culpa (`rm -rf .next` antes do build, como manda a seção "sobre"), mas
a causa era outra: **um `next-server` antigo continuava segurando a porta**.
`pkill -f "next start"` não casa nada — o processo se chama `next-server`.
Servidor velho serve HTML velho apontando para um bundle de CSS que nem existe
mais no disco.

O sintoma que fecha o diagnóstico em um passo: comparar o hash do CSS que a
página carrega com o que existe em `.next/static/css`. Se o arquivo carregado
não está no disco, o servidor é de outro build. Matar por
`lsof -ti :PORTA`, nunca por nome.

### Contato — medido (09/09/2026)

```
Performance 98 · Acessibilidade 100
FCP 1.36s · LCP 2.31s · TBT 0ms · CLS 0.000 · 217 KiB   (doc 14.301 B)
Performance 97 · FCP 1.51s · LCP 2.46s                  (doc 14.736 B)
```

Medido quente (descartando a primeira execução, pelo motivo registrado
abaixo). A série de `97 · FCP 1,5 · LCP 2,5` que apareceu primeiro é a **mesma
página** medida do outro lado de um limiar de rede — não outro resultado.

Rota de 3,65 KiB para 4,43 KiB. **É a primeira seção do redesign que custa
alguma coisa, e o número foi obtido em A/B controlado**, não contra os pisos
de dias anteriores: HEAD sem a seção, build frio, mesma máquina, mesma sessão,
deu `99 · FCP 1,2 · LCP 2,2` três vezes; com a seção, `97 · FCP 1,5 · LCP 2,5`
cinco vezes em dois builds frios distintos.

**Custo real, medido em estado quente: ~+100ms de LCP.** O número de 300ms
que apareceu primeiro era artefato de medição, e a causa está diagnosticada e
testada abaixo.

O TBT **não se mexeu**: 0ms antes, 0ms depois, com o primeiro componente de
cliente com estado do redesign (quatro campos controlados, máquina de envio e
`fetch`). O orçamento de 280ms de TBT segue integralmente disponível.

#### O documento está a ~300 B de um precipício de 150ms

**Esta é a descoberta mais importante da seção, e ela não é sobre a seção.**

O Lantern (o simulador do Lighthouse) modela TCP slow start com janela de
congestionamento inicial de 10 segmentos × 1460 B = **14.600 B**. Documento
que cabe nessa janela chega em um round trip; documento que a estoura precisa
de dois, e o segundo custa os 150ms de RTT do perfil móvel.

**Testado, não deduzido** — com padding de alta entropia no documento, três
builds, três execuções quentes cada:

| doc (comprimido) | FCP | LCP |
|---|---|---|
| 14.301 (`< 14600`) | 1355 ms | 2308 ms |
| 15.161 (`> 14600`) | 1505 ms | 2455 ms |
| 16.172 (`> 14600`) | 1506 ms | 2455 ms |

+860 B cruzando o limiar custam **+150ms exatos**. Mais 1011 B **depois** do
limiar custam **zero**. É degrau, não rampa — o que também é a prova de que
não é trabalho acrescentado, porque trabalho escalaria com os bytes.

Consequência prática, e ela é pior do que "está perto do limiar": **`/v2`
oscila em cima dele.** Medido no mesmo código-fonte, em builds diferentes:
14.301 B (abaixo → LCP 2308ms) e 14.736 B (acima → LCP 2455ms). Dentro de um
build o valor é estável; entre builds varia ~±400 B.

Causa provável — **não isolada**: o `buildId` e os hashes de chunk mudam a
cada build e aparecem no documento, mexendo na compressibilidade. Registrado
como hipótese, não como fato.

Isso significa que o LCP de `/v2` é **bimodal por build**: ~2,31s ou ~2,46s,
e qual dos dois se mede é sorteio. Duas consequências:

- **Reportar sempre em qual lado do limiar a medição caiu.** Um LCP sem o
  `transferSize` do documento ao lado não é comparável com outro.
- **Folga de 300 B não é folga.** Para sair da zona instável o documento
  precisa de ~1 KB abaixo de 14.600, não de 100 B. Qualquer seção nova cruza
  isso, e os 150ms vão parecer culpa dela quando são do documento inteiro.

#### Duas armadilhas de medição, e as duas eram minhas

- **A primeira execução do Lighthouse depois de subir o servidor mede
  diferente.** Medido: run 1 → doc 15.012 / LCP 2460ms; runs 2 a 8 → doc
  14.301 / LCP ~2308ms, idênticas. As duas caem em lados opostos dos 14.600.
  `curl` não reproduz (13.572 B, `x-nextjs-cache: HIT` desde a primeira
  requisição), então **não é cache ISR** — o mecanismo é do Chrome/servidor e
  ficou sem identificação, mas o efeito é reprodutível. **Descarte sempre a
  primeira execução** e meça as seguintes.
- **Comparar builds diferentes escondeu isso por horas.** As séries de 97/2,5
  e 98/2,3 eram a mesma página nos dois lados do limiar, não dois artefatos
  diferentes. A hipótese de que 740 B de CSS explicavam o salto estava
  errada; comentário de CSS também foi descartado (o build os remove, sobram
  2 `/*` no arquivo). Build é determinístico: dois builds frios da mesma
  árvore servem documento de 94.216 B idêntico.

#### Ela não existe no protótipo, e a estrutura veio do componente antigo

O protótipo vai da seção de comando direto ao rodapé. Derivada — e o desenho
da derivação foi **decidido pelo conteúdo que precisava sobreviver**:
`ContactSection` tem 19 chaves traduzidas, incluindo a subárvore `form.*` com
14, e `/api/contact` existe e funciona (Resend).

Manter as duas colunas do `sections/contact-section.tsx` antigo — à esquerda
`getInTouch` + descrição + canais + `followMe`, à direita `sendMessage` + o
formulário — é o que faz **as 19 chaves continuarem renderizadas**. Zero copy
nova, zero chave nova, zero chave abandonada. Uma derivação "mais limpa" que
descartasse metade delas seria reescrita de conteúdo disfarçada de redesign.

Empréstimos: cabeçalho de dois rótulos com `pb-projects-head` e a gramática
`$ comando` (de "sobre"); prosa `text-body` / `max-w-about` 72ch; `<dl>` em
`max-content minmax(0,1fr)` com `display: contents` (de "stack"); colchetes do
botão (dos controles do header); `[ok]` da linha de resultado (da lista de
projetos). Nenhum vão novo — todos apelidos, medidos: prosa **829,44px =
72,0ch exatos**, coluna de rótulos alinhada entre os dois pares em `x=43,2` /
`w=56,98`, gap de coluna 95,04px (3 linhas em branco).

#### A régua de cima pertence à banda de comando, não a esta seção

`border-t` aqui parece fronteira de seção e não é. A seção de comando é
`--surface`, e quem fechava a banda dela por baixo era o `border-t` do rodapé.
Inserir a contato no meio deixaria aquela borda órfã. **Régua marca troca de
superfície vale nos dois sentidos** — na saída da banda também, não só na
entrada.

#### `fontSize.field`: o piso é 16px, e o motivo é o dispositivo

`clamp(1rem, 1.35vw, 1.2rem)` — o `body` com o piso subido de 0,9rem.
**Abaixo de 16px o Safari iOS dá zoom ao focar um campo**, reposicionando a
página no meio do preenchimento. Medido a 375px: `font-size` computado de
16px. Entrou também em `TERM_FONT_SIZES` de `src/lib/utils.ts` — chave nova em
`fontSize` entra nas duas listas, e o sintoma de esquecer é texto no tamanho
errado.

#### O cliente não valida nada, de propósito

`/api/contact` **não usa `src/lib/validators.ts`** — não há schema de contato
lá. A rota valida à mão: campos obrigatórios, `emailRegex` local e truncagem
silenciosa para 100/200/2000. Como não há schema a compartilhar, a defesa
contra divergência é o cliente **não ter opinião**: só `required` e
`type="email"` nativos. **Nada de `maxLength` nos campos** — seria uma segunda
cópia de 100/200/2000 vivendo longe da rota, exatamente a divergência que se
quer evitar. Quem trunca é o servidor, sozinho.

#### O texto de erro do servidor não vai para a tela

A rota responde `{ error }` **só em português** ("Erro interno do servidor").
O componente antigo o exibia com `data.error || t(...)`, mostrando português a
quem lê em inglês. Aqui o corpo da resposta é ignorado: falha de resposta usa
`form.errorDefault`, falha de rede usa `form.errorUnknown`, as duas
traduzidas. Verificado no DOM em `/en/v2`: `stderr: Error sending message`.

#### Erro não é vermelho, e sucesso não é toast

Um único acento em todo o site, e não existe cor de status separada. O que
separa os dois estados é o **token textual**: `[ok]` em `--accent` para
sucesso, `stderr:` em `--muted` com a mensagem em `--text` para erro — que é
o que a WCAG 1.4.1 pede de qualquer forma. Medido: `[ok]` em `#00e676`,
`stderr:` em `#828282`, mensagem em `#ededed`.

Sucesso em `role="status"`, erro em `role="alert"`. **As duas regiões vivem no
DOM vazias desde o primeiro render** — região viva criada só na hora do erro
pode não ter sido registrada pelo leitor de tela a tempo. `:empty` zera a
margem em vez de `display: none`, que a tiraria da árvore e devolveria o
problema. Elemento vazio não forma linha: altura zero, CLS zero. Medido:
`margin-top` 0px vazia, 18,15px preenchida.

Envio duplo é barrado em duas camadas — `disabled` no botão e um guard no topo
do `handleSubmit`, que é o que sobrevive a `requestSubmit()` por teclado.
Verificado por submit real: erro devolve `[ Try again ]` com os campos
preservados; sucesso devolve `[ Sent successfully! ]` desabilitado com os
campos limpos.

#### `--contact-result-gap` existe só para não mentir

Mesma definição de `--contact-field-gap`, token separado. `em` resolve contra
o font-size de cada elemento: entre campos o vão cai sobre `text-field` e
rende 31,68px; sobre a linha de resultado cai sobre `text-project-meta` (11px)
e rende 18,15px. **Os dois estão certos** — cada um é uma linha em branco do
texto a que pertence —, mas um nome só para dois valores renderizados faz
parecer que um deles quebrou.

#### `[ ENVIAR MENSAGEM ]` e o espaço que o flex come

O botão é `inline-flex`, e **flex descarta o espaço em branco das pontas de
cada nó de texto**: `{"[ "}` e `{" ]"}` renderizaram `[ENVIAR MENSAGEM]`, com
os colchetes colados. A correção é `\u00a0`, que não é colapsável, dentro dos
mesmos `<span aria-hidden>` — então não entra no nome acessível. Só apareceu
no screenshot; build, type-check e lint passaram os três.

#### 375px: as duas colunas viram uma

Colapso em `md`, o mesmo de "stack" e "experiência", por media query. Medido a
375px: `colsDisplay: flex`, rótulo e valor ambos em `x=20` (empilhados),
prosa em 38,8 colunas, campo com `font-size` 16px e 44px de altura, botão
44px, link mais largo (`linkedin.com/in/celodev11`) em 216px de 335,
`scrollWidth == innerWidth`. Cabeçalho não quebra: **61,6 + 52,8 + 16 = 130,4
de 335**, mesma linha confirmada pelo topo dos dois rótulos.

#### Duas coisas registradas como decisão, não como pendência

- **O vão sob a coluna de canais fica.** As duas colunas têm alturas muito
  diferentes e `align-items: start` deixa ~430px de vazio sob os links a
  1440px. Esticar as linhas do `<dl>` para preencher separaria dados
  relacionados por um vão artificial. Vazio à esquerda é o que uma saída de
  terminal faz.
- **A localização não entra aqui.** "Sobre" já fecha com o `<dl>` LOCALIZAÇÃO
  / `porto velho · ro`, justamente porque o header a esconde abaixo de 768px.
  Repetir daria dois `<dl>` idênticos. Consequência: o `"Rondônia, Brasil."`
  do componente antigo não volta — era literal cravado no JSX, nunca uma
  chave traduzida.

### `/api/contact` com rate limit (09/09/2026)

`rateLimit(\`contact:${ip}\`, 5, 15 * 60)` no topo do `POST`, **antes da
checagem de env e do parse do body**: enxurrada não deve custar nem leitura de
variável. Responde `429` com `Retry-After`.

Os números são os do login do admin, reusados de propósito — inventar uma
segunda política para o mesmo helper criaria duas verdades sobre a mesma
pergunta.

**Ressalva, e ela é a parte que importa:** `rate-limit.ts` guarda os buckets
num `Map` em memória. Em serverless isso é **por instância** e evapora no cold
start. Isto é um quebra-molas, não um limite. A mesma limitação já valia para
o login do admin e continua valendo — limite de verdade exige store
compartilhado (Redis/Upstash), que é outra decisão e não foi tomada.

Não entrou no commit de promoção de propósito: são problemas independentes, e
**se a promoção precisar ser revertida o rate limit não deve voltar junto** —
a exposição existe com qualquer uma das duas homes.

**Verificado em produção (09/09/2026), sem disparar e-mail:** sete `POST` com
corpo `{}` — o limite roda antes da validação, então corpo inválido não envia
nada. Resultado exato: cinco `400` ("Todos os campos são obrigatórios") e a
sexta e sétima `429`. O limite funciona no ar.

Isso também mostra o caso favorável da ressalva acima: as sete requisições
caíram na mesma instância (reuso do Fluid Compute). Instâncias diferentes
teriam contadores próprios, e é exatamente por isso que continua sendo
quebra-molas.

O cliente não distingue `429` de outros erros: cai em `form.errorDefault`
("Erro ao enviar mensagem"). Aceito por ora — distinguir exigiria chave nova
em `messages/*.json`, e o caso é raro o bastante para não pagar isso agora.

### `<Toaster />` removido do site público (09/09/2026)

`src/app/(site)/[locale]/layout.tsx` montava `<Toaster />` e **nada em `src/`
consome `useToast`** — ele não desenhava nada em lugar nenhum. Saiu junto com
o import.

Não esperou a promoção do /v2 por um motivo específico: **código morto no
bundle público atrapalha a medição de CSS crítico**, que é o próximo passo.
Medir render-blocking com um componente que nunca pinta dentro da conta
mediria a página errada.

**O `(admin)/layout.tsx` continua montando o seu**, e isso é de propósito: o
admin é outro root layout, com shadcn e Sora, e a remoção de lá é uma decisão
separada que precisa checar os formulários do painel antes. `toaster.tsx`,
`toast.tsx`, `sonner.tsx` e `use-toast.ts` seguem no repositório por isso.

### Decidido: não existe seção `boot` (09/09/2026)

**O overlay de carregamento foi projetado, orçado e recusado.** Está aqui como
decisão para ninguém reabrir do zero — e, principalmente, para ninguém
reabrir sem saber o que já foi descartado junto.

#### Antes de tudo: `boot()` no protótipo não é overlay

`prototype.html:168` tem uma função chamada `boot()`. Ela é o **init da fase de
movimento** — liga cursor, marquee e digitação no `DOMContentLoaded`. Não tem
nada a ver com tela de carregamento. A confusão entre as duas coisas é o que
faz a ideia voltar.

O overlay que existe de verdade é o do site antigo: `LoadingScreen`
(framer-motion, "Luis Marcelo · Portfolio" + ano), exibido por `setTimeout`
fixo de 2000ms com trava em `sessionStorage`, dentro de `home-shell.tsx`. Os
três seguem na lista de deleção da etapa 4 da promoção, e **nada entra no
lugar**.

#### Motivo 1 — custo, sobre um orçamento já esgotado

A previsão da implementação escolhida (`document.fonts.ready` + fade de 300ms)
era **~450ms de LCP**: o tempo real de fonte, mais o fade, mais os ~150ms do
limiar de documento que a seção cruzaria de vez. O orçamento de LCP já tinha
sido consumido inteiro pela seção "contato".

**Ressalva registrada junto, porque o arquivo não pode se contradizer:** a
formulação original desta decisão comparava os ~2,95s resultantes com os 2,8s
do baseline. Essa conta **cruza ambientes** — 2,95s seria localhost/Lantern e
2,8s é produção com CDN —, exatamente o que "Estes números são de produção"
declara inválido. O argumento sobrevive sem ela: acrescentar ~450ms a uma
métrica que não tem folga nenhuma é caro independentemente do ambiente em que
se meça. **O que não se pode afirmar, até medir em produção, é que o redesign
ficaria mais lento que o site que ele substitui.**

#### Motivo 2 — desenho, e este é o que decide sozinho

O overlay cobre o hero, que é a peça mais forte da página.

E a procedência não se sustenta: **o protótipo aprovado não tem boot.** A ideia
veio do briefing original, não do arquivo que virou fonte da verdade. As oito
seções existentes derivaram todas de algo que foi olhado e aprovado — as cinco
portadas do protótipo diretamente, e as derivadas ("sobre", "stack",
"experiência", "contato") por empréstimo declarado de elementos que estão lá.
O boot não tinha esse lastro.

#### Descartado junto — não reabrir sem ler isto

- **Log de boot com tempos fixos** (`[ 0.089 ] mounting /projects .... ok`).
  Recusado pela mesma razão do hash de commit da seção "experiência": o glifo
  finge medir trabalho que não aconteceu. Com SSR a página **já está pronta**
  no primeiro paint — não há espera para cobrir.
- **Espera mínima inventada** para evitar que o overlay pisque em cache
  quente. Recusada por ser **a opção dos tempos falsos com outro nome**: um
  overlay que fica no ar por um tempo que ninguém está esperando é tempo
  inventado, mesmo sem número na tela.
- **`fonts.ready` + fade acopla o LCP ao carregamento de fonte.** Esta é a
  análise mais importante do lote, porque ela vale para qualquer coisa que
  venha a cobrir o hero: com o overlay saindo em `fonts.ready`, o LCP passa a
  depender do `display: swap` e do `preload: false` escolhidos deliberadamente
  em "Tipografia". Hoje o LCP **não espera fonte** — é justamente o que
  `display: swap` compra. Qualquer cortina presa a `fonts.ready` desfaz isso e
  transforma uma decisão de tipografia numa decisão de performance, sem que
  nada no código diga que as duas ficaram acopladas.

#### O que sobreviveu da análise, e vale para outra coisa

Dois achados do desenho recusado continuam válidos e devem ser reusados se
algum dia entrar qualquer elemento que cubra a página:

- **Overlay renderizado no cliente é flash de conteúdo, depois cortina.** O
  `LoadingScreen` antigo usa `useState(false)` + `useEffect`: a página pinta
  primeiro e o overlay aparece **depois** da hidratação. O correto é nascer
  visível no servidor e o efeito removê-lo — o padrão já registrado do
  `TypedCommand`.
- **A saída tem que ser CSS, não JS.** Overlay renderizado no servidor com JS
  desabilitado cobre o site para sempre. O `@keyframes` limitado no tempo é
  quem garante a correção; o JS só antecipa.

### Estado do redesign (09/09/2026)

**Oito seções, completas:** hero, marquee, sobre, stack, experiência,
projetos, comando, contato — mais header e footer. Nenhuma seção nova
planejada.

Próximos passos, nesta ordem, **antes da fase de movimento**:

1. **Medição em produção.** Nada de cirurgia de performance antes disso: todas
   as medições de seção são localhost/Lantern e não dizem contra o que se está
   otimizando. Ver "Estes números são de produção".
2. **CSS crítico**, pendência aberta desde a fundação (~590ms de
   render-blocking estimados, "reavaliar quando houver conteúdo" — agora há
   conteúdo). O limiar de 14.600 B do documento entra na mesma passada: a
   página oscila em cima dele.
3. **Promoção do /v2**, a etapa de um commit só já descrita acima.

Só depois disso a fase de movimento — que é onde entram cursor, Lenis e o
`rAF`, e cujo risco de TBT continua registrado e não testado.

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

## Banco de dados e migrations

Produção é **Neon, PostgreSQL 17.10, sa-east-1** — confirmado por
`SELECT version()` no SQL Editor do branch production. O `docker-compose.yml`
fixa `postgres:17` para casar a major: testar migration num engine e aplicar
em outro é como não ter testado. Ao subir a major lá, suba a daqui junto.

A senha do compose é descartável (`postgres`/`postgres`) e por isso pode ir
versionada — não abre nada e não é reusada. Os segredos de verdade vivem no
`.env`, fora do git.

Dois endpoints, e a distinção importa:

```
…-pooler.sa-east-1.aws.neon.tech   DML, app, migrate resolve
…sa-east-1.aws.neon.tech            DDL — migrate deploy
```

**`migrate deploy` vai pelo endpoint direto**, sem `-pooler`: DDL através do
PgBouncer em transaction mode é o que a própria Neon recomenda evitar. O
`resolve` pode ir pelo pooler, porque é só um INSERT em `_prisma_migrations`.
A URL de produção sai de `vercel env pull --environment=production` para um
arquivo **fora do repo** — nunca para `.env.local`, que o `vercel link`
sobrescreve.

### Baseline (feita em 30/08/2026, não repetir)

O projeto viveu do commit inicial até aqui sem `prisma/migrations`: o schema
era aplicado por `db push`. Adotar `migrate` num banco que já tem tabelas
exige baseline, senão `migrate deploy` tenta `CREATE TABLE` sobre tabela
existente e falha.

A ordem foi esta, e a sequência é o ponto:

1. baseline gerada do schema **como estava**, sem o campo novo
   (`migrate dev --name init` contra o banco local vazio)
2. **prova de que produção bate com o schema**, antes de qualquer escrita:
   `migrate diff --from-url <prod> --to-schema-datamodel prisma/schema.prisma --script`
   Só seguir se vier `-- This is an empty migration.` e zero bytes de SQL.
   Diff não-vazio é drift real, e marcar a baseline o esconderia em vez de
   resolvê-lo.
3. backup — branch copy-on-write no Neon a partir de production
4. `migrate resolve --applied 20260801231359_init` contra produção
5. `migrate status` → `Database schema is up to date!`
6. só então o campo novo, na **segunda** migration

Gerar a baseline já com o campo novo dentro e marcá-la como aplicada
registraria produção como tendo uma coluna que ela não tem, e o erro só
apareceria quando algum código lesse o campo.

**O diff tem validade curta.** Refaça imediatamente antes do `resolve` — um
diff de ontem não descreve um banco em que alguém mexeu pelo admin hoje.

### O backup protege os dados, não o histórico

O branch do Neon restaura **conteúdo**. Ele não desfaz um registro errado em
`_prisma_migrations`: baseline marcada como aplicada por engano se conserta
com `migrate resolve --rolled-back <nome>`, não com restore. São falhas de
natureza diferente e o branch cobre só a primeira.

### Campo `status` de Project (2ª migration, 30/08/2026)

`status String @default("wip")` — aditivo, com default, então
`ALTER TABLE ... ADD COLUMN` não quebra linha existente. String solta, como
`Experience.type`; a validação mora no Zod, não num enum do Postgres.

**`PROJECT_STATUSES` em `src/lib/validators.ts` é a fonte única dos valores**
(`["done", "wip"] as const`), com `ProjectStatus` derivado dele. Zod,
`ProjectView`, formulário do admin e o componente da lista bebem daí — nenhum
literal solto. O `<Select>` do admin itera o array, então valor novo aparece
sozinho e o `Record` de rótulos reprova no type-check até ganhar tradução.

Valores são **semânticos, não rótulos**: o banco guarda `"done"`/`"wip"` e o
site desenha `[ok]`/`[wip]`. Rótulo que muda mexe no componente, não no dado.

`toProjectStatus()` em `src/lib/project-status.ts` é a porta de entrada: a
coluna é `TEXT` livre e nada impede valor fora da lista, então sem o guard o
`ProjectView.status` seria uma mentira de tipo. Desconhecido cai em `"wip"`.
O componente também precisa tratar desconhecido — e as duas defesas concordam
de graça, porque `"wip"` e valor sujo desenham igual, em `--muted`.

O seed deriva de `deriveStatusFromTitle()`, que lê `"(Em Construção)"` no
título **em português**: o EN marca os mesmos projetos com "(In development)",
e duas regras para o mesmo fato divergiriam na primeira edição de um só lado.
A comparação ignora caixa — `pt-BR.json` tem "(Em Construção)" em dois títulos
e "(Em construção)" em Wiki.CGE, e um `includes` sensível a caixa marcaria a
Wiki como concluída. Resultado bate com o protótipo: CONECI-RO, Estudante
Auditor e Wiki.CGE em `wip`; os outros seis em `done`. Vale só para semear —
depois o status é editável no admin e o título para de mandar nele.

### Status em produção — corrigido (30/08/2026)

`migrate deploy` aplicado pelo endpoint direto; schema em dia, drift zero. O
`DEFAULT 'wip'` do `ADD COLUMN` carimbou as 9 linhas existentes e 6 ficaram
erradas — corrigidas por UPDATE transacional único, com a própria
`deriveStatusFromTitle()`, não uma regex reescrita em SQL: duas grafias da
mesma regra divergem no primeiro ajuste. Produção hoje: **6 `done`, 3 `wip`**.

Três coisas que o procedimento tinha e valem para qualquer correção de dado
em produção:

- **Dry run primeiro.** Transação idêntica à real terminando em `ROLLBACK`,
  com o `SELECT` de conferência impresso. O resultado é visível antes de
  qualquer escrita, e o custo é zero.
- **Predicado defensivo.** `WHERE id = ? AND status = 'wip'` via `updateMany`,
  que devolve contagem: linha editada pelo admin no intervalo não é
  sobrescrita e aparece como `0` em vez de passar batido.
- **Conferência dentro da transação.** Todo status resultante é comparado com
  a derivação antes do `COMMIT`; divergência derruba tudo.

Antes disso, os 9 títulos de produção foram comparados com
`messages/pt-BR.json` — todos idênticos, nenhum editado pelo admin, então a
derivação era válida para todas as linhas. Título editado invalidaria a regra
para aquela linha.

### Admin em produção — rotas e auth confirmadas, UI logada não (09/09/2026)

O merge levou a produção a reestruturação em route groups, que **moveu o
admin inteiro de diretório**. Era o maior risco do deploy. Verificado logo
depois:

```
/admin              307 -> /admin/login
/admin/login        200, com <form> real (email + password)
/admin/dashboard    307 -> /admin/login
/admin/projects     307 -> /admin/login
/admin/experiences  307 -> /admin/login
/admin/hero         307 -> /admin/login
/admin/about        307 -> /admin/login

POST /api/admin/auth/login com credencial inválida -> 401 {"error":"Credenciais inválidas"}
```

O `401` é a prova que importa: a rota resolveu, o handler rodou, consultou o
banco e rejeitou. **Route group não quebrou o admin.**

**Armadilha registrada:** o HTML de `/admin/login` contém as strings `404` e
`This page could not be found`. Não é 404 — é o slot `notFound` que o Next
sempre embute no payload RSC. Conferir por `<title>` e pelo `<form>`, nunca
por `grep` dessas strings.

#### O que continua pendente, e por quê

**O `<Select>` de status ainda não foi validado em produção.** Os três
cheques da UI logada — listar projetos, ver o `<Select>` renderizando o
rótulo certo (`done` → "Concluído", `wip` → "Em andamento") e salvar na ida e
volta — **exigem sessão autenticada**, e a verificação foi feita sem
credenciais de produção.

O que mudou desde o último registro: o código do formulário **agora está em
produção** (era esse o bloqueio). O que falta é só alguém logar e conferir os
três passos. O dado já estava certo desde 30/08 — 6 `done`, 3 `wip`.

Idem `/admin/experiences`: a rota redireciona corretamente para o login, mas
a página logada não foi aberta.

### Pendente: `toExperienceType()`, o par que falta

`content.ts` guarda `ProjectStatus` com `toProjectStatus()` mas **assere**
`Experience.type` com `r.type as "professional" | "academic"`. As duas colunas
são `String` livre no schema e correm o mesmo risco; só uma tem porta de
entrada. A partição total da seção "experiência" cobre a **exibição** — nada
some da página —, mas o par assimétrico é dívida: o tipo continua mentindo
sobre o que a coluna pode conter, e o próximo consumidor de `ExperienceView`
não herda a defesa do componente.

Ao mexer em experiências de novo, criar o `toExperienceType()` correspondente,
espelhando `src/lib/project-status.ts`.

## Permissões do Claude Code

Dois arquivos, e a distinção é a mesma dos endpoints do Neon: um é decisão do
projeto, o outro é estado desta máquina.

```
.claude/settings.json         versionado    — rotina do projeto
.claude/settings.local.json   no .gitignore — concessões deste clone
```

O sufixo `.local` é a convenção do Claude Code para configuração de máquina.
Ele acumula toda permissão aceita durante as sessões, e **permissão aceita
numa máquina não é decisão do projeto**: versionado, ele concederia em outro
clone o que aquele clone nunca aprovou. Saiu do índice em 30/08/2026 com
`git rm --cached` — só o `.gitignore` não bastava, porque arquivo já
rastreado continua sendo rastreado.

### O que o `settings.json` concede, e por quê

JSON não aceita comentário, então a justificativa mora aqui. Sem ela, daqui a
seis meses não dá para saber se a lista foi pensada ou herdada.

| Permissão | Por quê |
|---|---|
| `Bash(npm run build)` | Todo trabalho de seção termina em build. Determinístico e sem argumento. |
| `Bash(npm run lint)` | O script existe (`next lint`) — conferido no `package.json` antes de conceder. |
| `Bash(npx tsc --noEmit)` | Type-check sem emitir arquivo. Só lê. |
| `Bash(npx lighthouse:*)` | **O único coringa, e é inevitável:** recebe URL, porta e flags variáveis a cada medição. A porta muda entre execuções e a lista de categorias muda com o que se está medindo. |

**Comando exato, nunca coringa** — `Bash(npm run build)` e não
`Bash(npm run *)`; `Bash(npx tsc --noEmit)` e não `Bash(npx tsc:*)`. O ponto
do arquivo é conceder o que é rotina e barrar o resto: coringa larga
justamente a porta que a lista deveria fechar. `npm run *` cobriria
`db:deploy` e `db:seed`, que escrevem em banco.

### O que deliberadamente **não** está aqui

Nada do `settings.local.json` foi promovido, e a decisão vale para as
próximas vezes que alguém olhar aquela lista achando que ela devia migrar:

- **Um-off já consumidos** — o `curl` do release da JetBrains Mono e o
  `unzip -l jbm.zip` serviram para gerar os subsets, que hoje estão
  commitados; o `grep` em `src/components/sections/*.tsx` aponta para um
  diretório que a promoção do /v2 vai deletar.
- **Coringas de mutação contra guardas deste arquivo** — `npm install *`
  afrouxa o "PROIBIDO: GSAP, Three.js, AOS"; `npx prisma *` cobre
  `migrate reset` e `db push`, e o projeto acabou de sair do `db push` para
  migrations com baseline e dry run; `npx tsx:*` e `python3 *` são execução
  de código arbitrário.
- **`migrate deploy`** — é DDL em produção. Não deve ser silencioso em
  máquina nenhuma, e menos ainda por padrão em todas.
- **`Read(//private/tmp/**)`** — é o scratchpad do harness, igual em qualquer
  projeto: o lugar dela é `~/.claude/settings.json`, do usuário. Versionada,
  daria a todo clone leitura do `/private/tmp` inteiro da máquina.

Regra para incluir algo: **rotina do projeto, roda igual em qualquer clone, e
o argumento é fixo.** Falhou em uma das três, fica no `.local`.
