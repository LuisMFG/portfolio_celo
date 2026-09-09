import { getTranslations } from "next-intl/server";
import type { ExperienceView } from "@/src/lib/content";
import { ExperienceEntry } from "./experience-entry";

type ExperienceSectionProps = {
  experiences: ExperienceView[];
};

/**
 * Seção "experiência". **Não existe no protótipo** — ele vai de hero a
 * marquee a lista de projetos a comando. Derivada, como "sobre" e "stack".
 *
 * Server component: nenhum estado, nenhum evento, zero JS de cliente, e
 * nenhuma entrada animada — o protótipo só anima o hero, e entrada por scroll
 * pede IntersectionObserver, que é a fase de movimento.
 *
 * ### O que foi emprestado de onde
 *
 * - **Cabeçalho de dois rótulos de 11px** com o vão de `pb-projects-head`, da
 *   lista de projetos (`prototype.html:101`). Contador `NNN / palavra`
 *   derivado do tamanho da lista, como `009 / index` e `012 / stack` — nunca
 *   um literal. `log` é jargão de terminal e vale igual em PT e EN, mesmo
 *   precedente do `exit 0` do rodapé: nenhuma chave nova em `messages`.
 * - **Grid de duas colunas `max-content minmax(0,1fr)`**, da seção "stack".
 *   Lá alinha rótulos de domínio; aqui, a trilha de períodos. Mesmo
 *   `--project-gap`, mesmo `align-items: baseline`, mesma ausência de largura
 *   fixa inventada.
 * - **Fundo `--bg`, e por isso nenhuma `border-top`.** Régua marca troca de
 *   superfície, não fronteira de seção. "sobre", "stack", esta e "projetos"
 *   dividem o mesmo fundo; o separador entre elas é o vão vertical.
 *
 * ### Sem régua entre entradas — decisão, não acabamento faltando
 *
 * A lista de projetos tem régua porque é tabela: quatro colunas de dado curto
 * por linha. Isto é prosa em blocos, e prosa se separa por espaço — a regra
 * que "sobre" já aplicou. Régua aqui desenharia uma segunda tabela competindo
 * com a lista de projetos, que é a peça central da página.
 *
 * ### Nada de `<section>` por grupo
 *
 * Os grupos são `<div>` com `<h3>`, não `<section>` nomeada. Duas `region`
 * chamadas "Profissional" e "Acadêmica" acrescentariam ruído a uma lista de
 * landmarks que já tem banner, main, quatro regiões e contentinfo — e a
 * navegação que importa aqui é por heading, que o `<h3>` já dá.
 *
 * ### Zero chave nova em `messages/*.json`
 *
 * `ExperienceSection.title`, `.professional` e `.academic` já existem
 * traduzidas e são exatamente os três rótulos de que a seção precisa.
 *
 * ### Duas ideias recusadas, e o motivo de cada uma
 *
 * - **Hash curto de commit** (`a3f9c21`) ao lado do cargo, como num
 *   `git log --oneline`. Fica de fora **mesmo derivado deterministicamente do
 *   conteúdo**: o problema não é o sorteio — que quebraria a hidratação por
 *   divergir entre servidor e cliente — é que o glifo finge endereçar um
 *   commit que não existe. Não há repositório onde "Coordenador de
 *   Transparência Ativa" seja um objeto. Ornamento tipográfico disfarçado de
 *   procedência é a mesma família das outras duas recusas abaixo.
 * - **Marcador `[atual]`** nas posições em curso, na gramática de colchetes do
 *   protótipo (`[ok]`/`[wip]`). Exigiria copy nova e, pior, inferir "em
 *   andamento" procurando `"Presente"`/`"Present"` numa string livre e
 *   traduzida — a armadilha do status derivado de título, que
 *   `toProjectStatus` existe para fechar. A própria string do período já diz
 *   "Presente".
 * - **Nível de proficiência ou senioridade**: dado que não existe no banco.
 *   Mesma recusa registrada em `stack.ts`.
 *
 * ### A trilha de períodos alinha **por grupo**, não entre grupos
 *
 * Cada `<ol>` é um grid próprio, então o `max-content` da coluna de períodos
 * é calculado dentro do grupo. Medido: com os dados de hoje as duas trilhas
 * coincidem nos dois idiomas — 203,5px em PT e 154,7px em EN — porque o
 * período mais longo tem o mesmo número de caracteres dos dois lados (25 em
 * PT, 19 em EN). **Isso é propriedade dos dados, não da folha de estilo.**
 * Um período editado no admin pode desalinhar as duas trilhas.
 *
 * Fica assim de propósito: cada grupo é um log próprio, e unificar a coluna
 * exigiria subgrid aninhado em três níveis (`groups` → `group` → `list`) para
 * ganhar alinhamento entre blocos que já estão separados por três linhas em
 * branco e um rótulo. Está registrado porque é o tipo de diferença que
 * alguém vê depois e lê como bug.
 *
 * ### A ordem dos grupos é explícita, e precisa ser
 *
 * `fetchExperiences` ordena por `type: "asc"`, e `"academic"` vem antes de
 * `"professional"` no alfabeto — na ordem de chegada a formação abriria a
 * seção. `GROUP_ORDER` fixa profissional → acadêmica, que é a ordem do site
 * antigo. A ordem *dentro* de cada grupo continua sendo a do banco (`order`).
 *
 * ### A partição é total, de propósito
 *
 * `Experience.type` é `String` livre no schema, não enum — a mesma armadilha
 * de `Project.status`, e `content.ts` faz `r.type as ...` sem guard. Dois
 * filtros por igualdade descartariam em silêncio qualquer valor fora da
 * lista, e uma entrada publicada sumiria da página sem nada acusar. Aqui o
 * desconhecido cai em `professional` — o mesmo default que `content.ts` já
 * usa quando o id não está no mapa de tipos.
 */

/** Profissional antes de acadêmica, como no site antigo. */
const GROUP_ORDER = ["professional", "academic"] as const;

type GroupId = (typeof GROUP_ORDER)[number];

export async function ExperienceSection({
  experiences,
}: ExperienceSectionProps) {
  const t = await getTranslations("ExperienceSection");

  // Partição total: nada é descartado por não casar com um filtro.
  const byGroup: Record<GroupId, ExperienceView[]> = {
    professional: [],
    academic: [],
  };
  for (const experience of experiences) {
    const group: GroupId =
      experience.type === "academic" ? "academic" : "professional";
    byGroup[group].push(experience);
  }

  return (
    <section
      aria-labelledby="experience-title"
      className="relative z-10 px-gutter py-section"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-4 pb-projects-head text-label-wide uppercase text-term-muted">
        <h2 id="experience-title" className="font-normal">
          {t("title")}
        </h2>
        <span>{`${String(experiences.length).padStart(3, "0")} / log`}</span>
      </div>

      {/* `text-body` no contêiner, não em cada entrada: os vãos derivam de
          `--about-para-gap`, que é em `em` e precisa resolver contra a escala
          do corpo — mesma decisão da seção "sobre". */}
      <div data-exp-groups className="text-body">
        {GROUP_ORDER.map((group) =>
          byGroup[group].length === 0 ? null : (
            <div key={group} data-exp-group>
              <h3 className="pb-projects-head text-label-wide font-normal uppercase text-term-muted">
                {t(group)}
              </h3>

              {/* `<ol>`: a ordem é curada (o campo `order` do banco) e
                  cronológica. As entradas não trazem índice visível — o
                  período já é o eixo de leitura da coluna esquerda. */}
              <ol data-exp-list>
                {byGroup[group].map((experience) => (
                  <ExperienceEntry
                    key={experience.id}
                    title={experience.title}
                    company={experience.company}
                    period={experience.period}
                    description={experience.description}
                  />
                ))}
              </ol>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
