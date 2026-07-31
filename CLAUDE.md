## Redesign em andamento: conceito "Dev Terminal"

Todo trabalho de UI neste projeto segue as regras abaixo. Elas não são sugestões.

### Tokens (fonte única da verdade: `src/styles/tokens.css`)
--bg #0A0A0A · --surface #111111 · --line #1F1F1F
--text #EDEDED · --muted #7A7A7A · --accent #00E676 · --warn #FFB020

Um único acento cromático em todo o site. Nunca introduzir uma cor nova sem me perguntar.

### Tipografia
- Interface inteira em mono (JetBrains Mono via `next/font/local`).
- Display: `clamp(3.5rem, 13vw, 15rem)`, tracking `-0.04em`, line-height `0.9`.
- Labels: `0.6875rem`, `letter-spacing: 0.18em`, uppercase, cor `--muted`.

### Movimento
- Easing padrão: `cubic-bezier(0.16, 1, 0.3, 1)`. Duração base 600–900ms.
- Só animar `transform` e `opacity`. Nunca `top/left/width/height`.
- Todo componente animado respeita `prefers-reduced-motion: reduce`.
- Cada elemento revela uma vez só (IntersectionObserver com `unobserve`).

### Stack — restrições rígidas
- Next.js App Router + TypeScript + Tailwind + Framer Motion.
- PROIBIDO: GSAP, Three.js, ScrollMagic, AOS, qualquer lib de animação extra.
- Exceção única já aprovada: Lenis (~2kb) para smooth scroll.
- Nada de valor mágico em componente: cor, spacing e easing sempre via token.

### Não negociável
- Mobile (375px) tratado como entrega, não como adaptação.
- Navegação por teclado com foco visível em todos os interativos.
- i18n PT-BR/EN e alternância de tema continuam funcionando após cada mudança.

### Referência viva
`/design/prototype.html` é a direção visual aprovada. Em caso de dúvida de
espaçamento, timing ou hierarquia, consulte esse arquivo antes de decidir.s