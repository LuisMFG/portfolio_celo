---
description: Implementa uma seção do redesign "Dev Terminal" seguindo o protótipo aprovado
argument-hint: <nome-da-secao>
---

Implemente a seção **$ARGUMENTS** do redesign, dentro de `/v2`.

## Antes de escrever código

1. Leia `design/prototype.html` e as regras de `CLAUDE.md`. O protótipo é a
   fonte da verdade para espaçamento, escala, timing e hierarquia.
2. Localize o conteúdo real desta seção no código atual (home antiga,
   `messages/*.json`, banco via `src/lib/content.ts`) e **preserve todo o
   texto, as traduções PT/EN e os dados**. Isto é um redesign visual, não uma
   reescrita de conteúdo. Nunca invente nome de projeto, cargo ou data.
3. Se a seção **não existe no protótipo**, derive-a: mesma escala tipográfica,
   mesmo gutter, mesmo ritmo de entrada, mesma gramática de labels e de
   colchetes. Mostre a proposta e espere meu OK antes de implementar.
4. Decida explicitamente o comportamento em **375px** e me diga qual foi. O
   protótipo não tem tratamento mobile — reprojetar, não espremer.

## Ao implementar

- Componentes tipados e reutilizáveis, um arquivo por componente, em
  `src/components/site/`.
- Zero valor mágico: cor, espaçamento, duração e easing sempre via token do
  `.theme-terminal` ou do namespace `term` do Tailwind.
- Só animar `transform` e `opacity`. Nunca `top/left/width/height`.
- Todo componente animado respeita `prefers-reduced-motion: reduce`.
- Server component por padrão. `"use client"` só quando houver estado,
  evento ou API de browser — e diga por que foi necessário.
- Nada de `cursor: none`, Lenis ou loop de animação: isso é a fase de
  movimento, não esta.

## Ao terminar

1. `npm run build` e corrija o que quebrar.
2. Rebuild + `npm start`, e meça:
   `npx lighthouse http://localhost:PORTA/v2 --only-categories=performance,accessibility --chrome-flags="--headless=new --no-first-run" --output html --output-path ./v2-$ARGUMENTS.html`
3. Compare com o piso registrado no `CLAUDE.md` (Perf 99 · A11y 100 · TBT 20ms
   · LCP 2.2s · CLS 0.001). O orçamento total até estourar a meta é 280ms de
   TBT e 300ms de LCP — para o site inteiro, não para esta seção.
4. Abra `localhost:PORTA/v2` no Playwright, screenshot em 1440px e em 375px,
   compare com o protótipo e me diga **onde divergiu e por quê**.
5. Confirme que PT/EN e dark/light continuam corretos na seção nova.
