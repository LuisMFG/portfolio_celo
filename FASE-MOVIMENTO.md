# Fase de movimento — escopo revisado

A fase de movimento é menor do que foi planejada. Antes de qualquer coisa,
audite o protótipo e confirme a leitura abaixo.

## A leitura

O protótipo aprovado (`design/prototype.html`) tem, de movimento:

- a entrada `rise` do hero
- o marquee
- o comando digitado
- o hover das linhas de projeto

**Todos já implementados e em produção.** O que resta dele são duas peças:

1. **Cursor customizado**
2. **Preview flutuante de projeto**

Lenis, smooth scroll com inércia, reveals por scroll nas demais seções e
hover magnético **não estão no protótipo** — vieram do briefing original,
como o boot, que foi cortado por esse mesmo motivo.

## O que fazer

Confirme se essa leitura bate com `design/prototype.html`.

Se bater, registre no `CLAUDE.md` que o escopo da fase de movimento são duas
peças, e que o **smooth scroll foi descartado**: sequestra o scroll nativo,
briga com a inércia do trackpad, é o único item que roda `requestAnimationFrame`
contínuo, e o protótipo nunca o teve.

Se a leitura estiver errada em algum ponto, diga qual antes de decidir.

## Orçamento

Contra produção real: LCP 1,9s de 2,5s e TBT 22–80ms de 300ms — folga de
~600ms e ~220ms. Melhor do que os números de localhost sugeriam.

Lembre da ressalva já registrada: TBT de 0ms medido com `setTimeout` não
prevê o custo de `requestAnimationFrame` contínuo. O cursor é o primeiro
teste real disso.

## Processo

Branch nova. O site está no ar — cada merge agora é deploy em produção.
