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
  return /\(em constru[çc][ãa]o\)/i.test(titlePt) ? "wip" : "done";
}
