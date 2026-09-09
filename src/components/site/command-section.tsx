import { getTranslations } from "next-intl/server";
import { TypedCommand } from "./typed-command";

/**
 * Seção "comando" do protótipo (`prototype.html:140-145`): o rótulo
 * `session · stdin` e a linha de terminal que se digita ao entrar no viewport.
 *
 * Server component. O único cliente é o `TypedCommand`, e o porquê está lá.
 *
 * O rótulo é `<h2>`, não `<div>` como no protótipo, pela mesma razão do
 * cabeçalho da lista de projetos: um `<section>` só é landmark `region` se
 * tiver nome acessível, e esta seção vive fora do `<main>` como as outras
 * abaixo do hero. O `<h2>` dá o nome e continua o outline do `<h1>`.
 *
 * O caminho da sessão vem de `HeroSection.prompt.path` de propósito, e não de
 * uma cópia em `CommandSection`: é o mesmo `~/luis-marcelo` do prompt do hero,
 * a mesma sessão. Duas cópias divergiriam na primeira edição de um lado só.
 *
 * **Decisão de 375px: a linha quebra em duas, ela não encolhe.** Medido, com
 * o `clamp()` no piso de 1rem: `~/luis-marcelo $ ls ./projects --all` mede
 * 328,3px de tinta contra 335px de linha útil — o texto cabe numa linha por
 * 6,7px. Quem não cabe é o cursor: ele pede mais 10,67px
 * (`--caret-gap` + `--caret-width`) e pintava até 359px, 4px para dentro do
 * gutter de 20px. Não gerava scroll horizontal, mas atravessava o gutter.
 *
 * As saídas eram três e a escolha é esta: **reservar o espaço do cursor**
 * (`--caret-reserve`), o que empurra `--all` para a segunda linha nesta
 * faixa de largura. As outras duas foram descartadas — baixar o piso do
 * `clamp()` para ~0,98rem é valor mágico atrás de um sintoma, e deixar os
 * 4px vazarem troca uma regra dura do projeto por 4px de aparência.
 *
 * Quebrar é o que um terminal estreito faz de verdade — e abaixo de 368px de
 * viewport o texto sozinho já não cabe, então a quebra aconteceria de
 * qualquer jeito. O `min-h-command` do protótipo continua valendo como piso
 * de uma linha, e o fantasma do `TypedCommand` reserva as duas linhas antes
 * do primeiro caractere, então a quebra não custa CLS.
 *
 * **Onde ela cai:** `~/luis-marcelo $ ls ./projects --` / `all`. O algoritmo
 * de linha do CSS também quebra depois de hífen, então o corte não cai no
 * espaço antes de `--all`. Testado: `word-break: keep-all` e
 * `overflow-wrap` em todas as combinações não suprimem quebra em hífen —
 * só embrulhar cada token num `nowrap` faria isso, ao custo de um token
 * longo passar a estourar a linha sem rede.
 *
 * Fica como está porque o corte cai a 33 de ~35 caracteres úteis, que é
 * praticamente a coluna: terminal de verdade quebra por coluna e não por
 * palavra, e ver `--` no fim da linha é o comportamento nativo dele, não um
 * defeito de tipografia.
 */
export async function CommandSection() {
  const t = await getTranslations("CommandSection");
  const tHero = await getTranslations("HeroSection");

  const line = `${tHero("prompt.path")} $ ${t("command")}`;

  return (
    <section
      aria-labelledby="command-title"
      className="relative z-10 border-t border-term-line bg-term-surface px-gutter py-section-lg"
    >
      <h2
        id="command-title"
        className="pb-command-head text-label-wide font-normal uppercase text-term-muted"
      >
        {t("label")}
      </h2>

      <TypedCommand text={line} />
    </section>
  );
}
