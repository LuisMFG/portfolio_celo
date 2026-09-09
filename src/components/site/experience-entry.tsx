import type { ExperienceView } from "@/src/lib/content";

export type ExperienceEntryProps = {
  title: ExperienceView["title"];
  company: ExperienceView["company"];
  period: ExperienceView["period"];
  description: ExperienceView["description"];
};

/**
 * Uma entrada da seção "experiência". **Não existe no protótipo** — o
 * porquê de cada empréstimo está no docblock da seção.
 *
 * Server component: nenhum estado, nenhum evento, nenhuma entrada animada.
 *
 * ### Hierarquia por cor, não por tamanho
 *
 * Cargo e descrição dividem a mesma escala (`text-body`) e se separam por
 * cor: o cargo em `--text`, a descrição em `--muted`. É a leitura de
 * terminal — comando aceso, saída apagada — e evita inventar um degrau
 * tipográfico entre `body` e `project` só para esta seção. O componente
 * antigo (`sections/experience-section.tsx`) já apagava a descrição pelo
 * mesmo motivo, com `text-muted-foreground`.
 *
 * Período e empresa são `text-project-meta`: os mesmos 11px com tracking
 * `.14em` do índice e da pilha de tecnologias da linha de projeto. Meta é
 * meta, e a linha de projeto já decidiu como meta se desenha.
 *
 * ### `<h4>`, e o nível não é decorativo
 *
 * O outline da página é `<h1>` do hero → `<h2>` da seção → `<h3>` do grupo →
 * `<h4>` do cargo. É por ele que o leitor de tela pula de cargo em cargo sem
 * atravessar as descrições. O `font-normal` desfaz o negrito do user agent:
 * peso não é eixo de hierarquia neste desenho, cor é.
 *
 * ### A empresa é `<p>`, não parte do `<h4>`
 *
 * Dentro do heading, "CGE/RO - Controladoria Geral do Estado de Rondônia"
 * entraria no nome acessível do cargo e a lista de headings viraria uma
 * parede de texto. Fora dele, o cargo é o rótulo curto que a navegação por
 * heading precisa.
 */
export function ExperienceEntry({
  title,
  company,
  period,
  description,
}: ExperienceEntryProps) {
  return (
    <li data-exp-entry>
      {/* Primeira coluna acima de `md`, primeira linha abaixo. O colapso é
          media query em `tokens.css` — nunca render condicional. */}
      <span
        data-exp-period
        className="text-project-meta uppercase text-term-muted"
      >
        {period}
      </span>

      <div data-exp-body>
        <div data-exp-head>
          <h4 className="font-normal text-term-text">{title}</h4>
          <p className="text-project-meta uppercase text-term-muted">
            {company}
          </p>
        </div>

        {/* A medida de 72ch é a mesma da prosa de "sobre" — o texto é do
            mesmo tipo e não tem por que ter outra largura de leitura. Abaixo
            de ~830px de coluna ela não morde, então o mobile não precisa de
            nada condicional. */}
        <p className="max-w-exp text-term-muted">{description}</p>
      </div>
    </li>
  );
}
