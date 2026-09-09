import { getTranslations } from "next-intl/server";
import { STACK_COUNT, STACK_GROUPS } from "@/src/lib/stack";

/**
 * Seção "stack". **Não existe no protótipo**, e o conteúdo dela já estava na
 * página: a faixa de tecnologias lista exatamente as mesmas doze.
 *
 * O que esta seção acrescenta é a única coisa que a faixa não consegue
 * mostrar — **estrutura**. A faixa é uma lista plana em movimento; o
 * agrupamento por domínio já existia implícito na ordem dela (o docblock do
 * marquee afirma isso em voz alta: "Tailwind fecha a corrida de front-end,
 * antes do bloco .NET/Spring, e Git fecha a de infraestrutura") e aqui vira
 * informação visível.
 *
 * **Categoria e só categoria.** Nada de nível de proficiência: esse dado não
 * existe nem no banco nem no `technologies.tsx`, e escala de senioridade
 * inventada é a coisa mais fácil de desmentir. O porquê mora em `stack.ts`,
 * junto da lista.
 *
 * Server component: nenhum estado, nenhum evento, nenhuma entrada animada —
 * mesma regra da lista de projetos e da seção "sobre".
 *
 * ### A faixa ficou `aria-hidden` por causa desta seção
 *
 * Com as doze aqui, a faixa passou a duplicar doze itens na árvore de
 * acessibilidade e a criar uma segunda `region` com o mesmo nome
 * ("Tecnologias") — duas regiões indistinguíveis numa lista de landmarks. Ela
 * virou textura pura. A cobertura ser completa não é suposição: o guard de
 * tipo `STACK_COVERS_MARQUEE`, em `stack.ts`, quebra o build se um dos lados
 * ganhar item que o outro não tem.
 *
 * ### Empréstimos, todos da lista de projetos
 *
 * Cabeçalho de dois rótulos de 11px com o vão de `pb-projects-head`, contador
 * `NNN / palavra` derivado do tamanho da lista, e o colapso em `md` por media
 * query — nunca render condicional. Nada de grade de cards nem de badge
 * colorida: a listagem é alinhada e monoespaçada, como a de projetos.
 *
 * O separador `·` em `--accent` e o `px-marquee-sep` vêm da faixa de
 * propósito. É a mesma lista de tecnologias com a mesma assinatura visual;
 * um separador próprio faria os dois desenhos discordarem sobre o mesmo dado.
 *
 * ### Decisão de 375px: o rótulo sobe, a lista ocupa a linha inteira
 *
 * Lado a lado, `./frontend` come 81px dos 335px úteis e sobra coluna estreita
 * demais — `TYPESCRIPT` sozinho mede 86px no piso da escala, então a lista
 * quebraria a cada um ou dois nomes. Empilhado, cada grupo recebe a linha
 * toda e quebra em duas linhas no máximo.
 *
 * O colapso é o mesmo da linha de projeto, no mesmo breakpoint (`md`, 768px),
 * e usa `display: contents` acima dele: as três duplas viram itens diretos do
 * mesmo grid, que é o que faz a coluna de rótulos ficar alinhada entre os
 * grupos sem nenhuma largura fixa inventada — ela é `max-content`, larga como
 * o maior rótulo e nada além disso.
 */
export async function StackSection() {
  // Mesmo rótulo traduzido que a faixa usava ("Tecnologias" / "Technologies").
  // Ele migrou para cá junto com o nome acessível.
  const t = await getTranslations("SkillsSection");

  return (
    <section
      aria-labelledby="stack-title"
      className="relative z-10 px-gutter py-section"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-4 pb-projects-head text-label-wide uppercase text-term-muted">
        <h2 id="stack-title" className="font-normal">
          {t("title")}
        </h2>
        {/* `stack` é jargão de terminal e vale igual em PT e EN, como o
            `exit 0` do rodapé — por isso não tem chave em `messages`. O
            número vem do tamanho da lista, como o `009 / index`. */}
        <span>{`${String(STACK_COUNT).padStart(3, "0")} / stack`}</span>
      </div>

      {/* `<dl>`: cada grupo é de fato um par termo/definição. O `<div>` de
          agrupamento é HTML5 válido dentro de `<dl>` e some acima de `md`
          (`display: contents`), para as duplas dividirem um grid só. */}
      <dl data-stack-list>
        {STACK_GROUPS.map((group) => (
          <div key={group.id} data-stack-group>
            <dt className="text-project-meta uppercase text-term-muted">
              {`./${group.id}`}
            </dt>
            <dd>
              {/* `role="list"`: `display: flex` no `<ul>` remove a semântica
                  de lista no VoiceOver. Aqui a lista é o conteúdo da seção,
                  então "lista de 5 itens" é informação que não pode sumir. */}
              <ul
                role="list"
                className="flex flex-wrap text-body uppercase text-term-text"
              >
                {group.items.map((name, i) => (
                  <li key={name} className="whitespace-nowrap">
                    {name}
                    {/* Depois de cada item menos o último — ao contrário da
                        faixa, onde o separador final costura a emenda entre
                        as duas cópias. Aqui não há emenda. */}
                    {i < group.items.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="px-marquee-sep text-term-accent"
                      >
                        ·
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
