import { PROJECT_STATUSES, type ProjectStatus } from "./validators";

/**
 * Narrowing do `status`, que no banco é uma coluna `TEXT` livre. Nada impede
 * uma linha com valor fora da lista — migration antiga, escrita manual, seed
 * de terceiro — e `ProjectView.status` promete `ProjectStatus`. Sem esta
 * porta o `as ProjectStatus` seria uma mentira de tipo.
 *
 * Desconhecido cai em "wip", que é o mesmo default da coluna. O componente
 * também trata desconhecido, e as duas defesas concordam de graça: "wip" e
 * valor sujo desenham igual, em `--muted`.
 */
export function toProjectStatus(value: unknown): ProjectStatus {
  return PROJECT_STATUSES.includes(value as ProjectStatus)
    ? (value as ProjectStatus)
    : "wip";
}

/**
 * Deriva o status do título em português.
 *
 * Os projetos em andamento se anunciam no próprio conteúdo — "(Em Construção)"
 * no título — e é de lá que o status sai, em vez de uma lista paralela que
 * poderia divergir do texto. Bate exatamente com o protótipo: CONECI-RO,
 * Estudante Auditor e Wiki.CGE em `[wip]`; Gerenciador de Horários e
 * 3D Card Chaewon em `[ok]`.
 *
 * Do título **em português**, não do traduzido: o EN marca os mesmos três
 * projetos com "(In development)". Duas regras para o mesmo fato divergiriam
 * na primeira vez que alguém editasse um só dos lados.
 *
 * A comparação ignora caixa de propósito: `messages/pt-BR.json` escreve
 * "(Em Construção)" em dois títulos e "(Em construção)" em Wiki.CGE. Um
 * `includes` sensível a caixa marcaria a Wiki como concluída.
 *
 * Vale só para semear. Depois disso o status é editável no admin e o título
 * deixa de mandar nele.
 */
export function deriveStatusFromTitle(titlePt: string): ProjectStatus {
  return PT_WIP_MARKER.test(titlePt) ? "wip" : "done";
}

/** O marcador que `deriveStatusFromTitle` lê. Só o lado português, de propósito. */
const PT_WIP_MARKER = /\(em constru[çc][ãa]o\)/i;

/**
 * Marcador de andamento que alguns títulos ainda carregam dentro do próprio
 * texto — legado de antes da coluna `status` existir.
 *
 * Ancorado no fim e com a lista de variantes **fechada**, nunca um
 * `\([^)]*\)$` genérico: "3D Card Chaewon Yugioh" e qualquer título futuro com
 * parêntese informativo perderiam conteúdo. Só casam as três grafias que
 * existem no dado real — "(Em Construção)", "(Em construção)" e
 * "(In development)" — e a caixa é ignorada porque `messages/pt-BR.json` usa
 * duas delas.
 *
 * Cobre os dois idiomas, ao contrário de `PT_WIP_MARKER`: aqui o alvo é o
 * texto que vai à tela, e o EN marca os mesmos projetos com "(In development)".
 */
const TRAILING_STATUS_MARKER =
  /\s*\((?:em constru[çc][ãa]o|in development)\)\s*$/i;

/**
 * Tira do título o marcador que a coluna de status já comunica.
 *
 * **Só desenho.** O dado no banco e em `messages/*.json` fica intocado; quem
 * limpar na origem tem que mexer em `deriveStatusFromTitle` junto, senão o
 * próximo seed marca tudo como `done` (a pendência está em CLAUDE.md).
 */
export function stripStatusMarker(title: string): string {
  return title.replace(TRAILING_STATUS_MARKER, "");
}

/**
 * Glifo de cada status no desenho (`prototype.html:111`, `:129`).
 *
 * Mora aqui, junto da limpeza do título, porque os dois lados são a mesma
 * decisão: o marcador sai do nome exatamente porque este colchete entra. Não
 * é rótulo acessível — esse é traduzido, em `ProjectsSection.status`.
 */
export const PROJECT_STATUS_GLYPH: Record<ProjectStatus, string> = {
  done: "[ok]",
  wip: "[wip]",
};
