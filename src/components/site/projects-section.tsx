import { getTranslations } from "next-intl/server";
import type { ProjectView } from "@/src/lib/content";
import { ProjectRow } from "./project-row";

type ProjectsSectionProps = {
  projects: ProjectView[];
};

/**
 * Lista de projetos do protótipo (`prototype.html:100-137`).
 *
 * Server component: nenhum estado, nenhum evento. O protótipo não anima a
 * entrada desta seção — as linhas não têm `data-rise` — e nada aqui inventa
 * uma: entrada por scroll pede IntersectionObserver, que é a fase de
 * movimento.
 *
 * O cabeçalho reaproveita `ProjectsSection.title` ("Projetos" / "Projects")
 * no lugar do "selected work" do protótipo, que não existe traduzido. Mesma
 * decisão do marquee: rótulo que já existe em vez de conteúdo novo. E é um
 * `<h2>` de verdade, não um `<span>` — dá nome à região (o `<section>` só é
 * landmark com nome acessível, como a faixa) e continua o outline do `<h1>`
 * do hero, que hoje não tem nenhum nível abaixo dele.
 *
 * O contador vem de `projects.length`, não de um literal: o protótipo mostra
 * `005 / index` porque desenha cinco projetos e aqui existem nove. Zero à
 * esquerda até três dígitos, como o índice de cada linha.
 *
 * **Decisão de 375px** (o colapso em si está em `tokens.css`, junto do grid):
 * a linha de quatro colunas vira três faixas empilhadas — índice e status
 * dividindo a primeira, nome ocupando a largura inteira na segunda,
 * tecnologias na terceira. O grid do protótipo daria ~150px ao nome a 375px;
 * empilhado ele recebe os 327px da linha. Nada mais muda: gutter, padding
 * vertical e escala tipográfica já são `clamp()`.
 */
export async function ProjectsSection({ projects }: ProjectsSectionProps) {
  const t = await getTranslations("ProjectsSection");

  return (
    <section
      aria-labelledby="projects-title"
      className="relative z-10 px-gutter py-section"
    >
      <div className="flex items-baseline justify-between gap-4 pb-projects-head text-label-wide uppercase text-term-muted">
        <h2 id="projects-title" className="font-normal">
          {t("title")}
        </h2>
        <span>{`${String(projects.length).padStart(3, "0")} / ${t("index")}`}</span>
      </div>

      {/* `<ol>`: a ordem é curada (o campo `order` do banco) e o índice
          visível a anuncia. A borda de cima fecha a lista contra o cabeçalho;
          a de baixo de cada linha vem do próprio `[data-project-row]`, para
          acompanhar o deslocamento do hover como no protótipo. */}
      <ol className="border-t border-term-line">
        {projects.map((project, i) => (
          <ProjectRow
            key={project.id}
            position={i + 1}
            title={project.title}
            technologies={project.technologies}
            status={project.status}
            statusLabel={t(`status.${project.status}`)}
            newTabLabel={t("newTab")}
            // O que o site tem para mostrar vem primeiro; o código é o
            // fallback. Projeto sem nenhum dos dois não vira link.
            href={project.liveUrl ?? project.githubUrl}
            image={project.image}
          />
        ))}
      </ol>
    </section>
  );
}
