/**
 * A pilha, em um lugar só.
 *
 * Ela vivia dentro de `marquee-section.tsx`. Com a seção "stack" listando as
 * mesmas tecnologias, duas cópias divergiriam na primeira edição de um lado
 * só — e o sintoma seria a faixa e a lista discordando na mesma tela.
 *
 * **As duas ordens são diferentes e as duas são intencionais.** A faixa segue
 * a ordem do protótipo (`prototype.html:95`), que não é agrupada: back-end
 * abre com Node.js/NestJS, front-end vem no meio e .NET/Spring voltam depois.
 * A seção agrupa por domínio. Por isso a ordem do marquee é uma lista própria
 * e não uma derivação de `STACK_GROUPS` — derivá-la reordenaria a faixa.
 *
 * O preço de duas listas é o risco de uma ganhar item que a outra não tem, e
 * é exatamente isso que `STACK_COVERS_MARQUEE` impede em tempo de compilação.
 *
 * Procedência de cada nome, conferida contra o código e não de memória:
 * os onze de `src/components/technologies.tsx` mais NestJS, que o protótipo
 * acrescenta e que é real — aparece na descrição do cargo na Biggelo, em
 * `messages/*.json`. A grafia é a da fonte (`Node.js`, `.NET`); o caixa-alta
 * do desenho é `text-transform`, então busca, cópia e leitor de tela recebem
 * o nome como ele se escreve.
 */

/**
 * Agrupamento por domínio. Os identificadores são jargão de terminal e valem
 * igual em PT e EN, como o `exit 0` do rodapé — por isso não há chave em
 * `messages/*.json` para eles.
 *
 * **Categoria, e só categoria.** Nem o banco nem o `technologies.tsx` guardam
 * nível de proficiência, e escala de senioridade sem dado por trás é a coisa
 * mais fácil de um recrutador desmentir.
 */
export const STACK_GROUPS = [
  {
    id: "frontend",
    items: ["TypeScript", "Next.js", "React", "Angular", "Tailwind"],
  },
  { id: "backend", items: ["Node.js", "NestJS", ".NET", "Spring"] },
  { id: "infra", items: ["PostgreSQL", "Docker", "Git"] },
] as const;

export type StackGroup = (typeof STACK_GROUPS)[number];
export type StackGroupId = StackGroup["id"];
type GroupedTechnology = StackGroup["items"][number];

/** Ordem da faixa, exatamente a do protótipo (`prototype.html:95`). */
export const MARQUEE_ORDER = [
  "Node.js",
  "NestJS",
  "TypeScript",
  "Next.js",
  "React",
  "Angular",
  "Tailwind",
  ".NET",
  "Spring",
  "Docker",
  "PostgreSQL",
  "Git",
] as const;

type MarqueeTechnology = (typeof MARQUEE_ORDER)[number];

/** Igualdade de conjuntos: `never` — e portanto erro de tipo — se divergirem. */
type Exact<A, B> = [A] extends [B] ? ([B] extends [A] ? true : never) : never;

/**
 * **Guarda de build, não decoração.** A faixa é `aria-hidden` justamente
 * porque a seção "stack" cobre a lista inteira; se uma tecnologia entrasse só
 * na faixa, ela sumiria da árvore de acessibilidade sem deixar rastro. Aqui
 * isso vira erro de type-check em vez de defeito silencioso.
 *
 * Tirar um item de um dos lados quebra o `npm run build`. É o que a lista do
 * `twMerge` em `src/lib/utils.ts` gostaria de ter e não tem.
 */
export const STACK_COVERS_MARQUEE: Exact<GroupedTechnology, MarqueeTechnology> =
  true;

/** Quantidade total, para o contador `012 / stack` do cabeçalho. */
export const STACK_COUNT = STACK_GROUPS.reduce(
  (total, group) => total + group.items.length,
  0,
);
