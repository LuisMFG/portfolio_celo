import {
  PROJECT_STATUS_GLYPH,
  stripStatusMarker,
} from "@/src/lib/project-status";
import type { ProjectStatus } from "@/src/lib/validators";

export type ProjectRowProps = {
  /** Posição na lista, começando em 1. Vira `001` no desenho. */
  position: number;
  title: string;
  technologies: readonly string[];
  status: ProjectStatus;
  /** Status por extenso, já traduzido. O colchete sozinho não comunica. */
  statusLabel: string;
  /** Rótulo de "abre em nova aba", já traduzido. Ignorado sem `href`. */
  newTabLabel: string;
  /** Destino do projeto, ou `null` quando não existe nenhum. */
  href: string | null;
  /**
   * Caminho da imagem do projeto, lido pelo `PointerLayer` no primeiro hover.
   *
   * Vai como `data-` e **não** como `<img>`: o atributo custa ~40 bytes por
   * linha no documento e nenhuma requisição. A imagem só é buscada quando o
   * ponteiro entra na linha, e só em `pointer: fine` — a maioria do tráfego é
   * mobile e nunca vê o preview.
   */
  image: string;
};

/**
 * Uma linha da lista de projetos (`prototype.html:107-112`).
 *
 * Server component: o hover inteiro é `:hover` em CSS, como no protótipo —
 * que só usava JS ali por causa do cursor customizado, e isso é a fase de
 * movimento.
 *
 * **Nem todo projeto é clicável.** CONECI-RO não tem `liveUrl` nem
 * `githubUrl`, e a lista vem do banco, onde os dois campos são anuláveis. Sem
 * destino a linha é o próprio `<li>`, não um `<a href="#">` como no protótipo:
 * link que não leva a lugar nenhum entra na ordem de tabulação e promete uma
 * navegação que não existe. As regras de hover pedem `a[data-project-row]`
 * justamente para que essas linhas não acendam nem se desloquem.
 *
 * O título perde o marcador de andamento que alguns ainda carregam no texto —
 * `stripStatusMarker`, só no desenho: a coluna de status já diz o mesmo, e o
 * dado no banco fica intocado.
 */
export function ProjectRow({
  position,
  title,
  technologies,
  status,
  statusLabel,
  newTabLabel,
  href,
  image,
}: ProjectRowProps) {
  const cells = (
    <>
      <span
        data-project-cell="index"
        className="text-project-meta uppercase text-term-muted"
      >
        {String(position).padStart(3, "0")}
      </span>

      <span data-project-cell="name" className="text-project font-normal">
        {stripStatusMarker(title)}
      </span>

      {/* `·` decorativo, como no marquee: separa no desenho e some na leitura,
          para a pilha ser lida como lista e não como pontuação. */}
      <span
        data-project-cell="tech"
        className="text-project-meta uppercase text-term-muted"
      >
        {technologies.map((tech, i) => (
          <span key={tech}>
            {i > 0 ? <span aria-hidden="true"> · </span> : null}
            {tech}
          </span>
        ))}
      </span>

      <span
        data-project-cell="status"
        className={`text-project-meta text-right uppercase ${
          status === "done" ? "text-term-accent" : "text-term-muted"
        }`}
      >
        <span aria-hidden="true">{PROJECT_STATUS_GLYPH[status]}</span>
        <span className="sr-only">{statusLabel}</span>
      </span>
    </>
  );

  if (!href) {
    return (
      <li data-project-row data-preview-src={image} className="text-term-text">
        {cells}
      </li>
    );
  }

  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-project-row
        data-preview-src={image}
        className="text-term-text outline-term-accent focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4"
      >
        {cells}
        {/* Sem `aria-label`: ele substituiria o nome acessível da linha
            inteira — índice, nome, pilha e status — por uma frase só. O aviso
            entra como texto oculto, no fim, onde o leitor de tela já terminou
            de anunciar o conteúdo. */}
        <span className="sr-only">{newTabLabel}</span>
      </a>
    </li>
  );
}
