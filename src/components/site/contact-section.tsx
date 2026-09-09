import { getTranslations } from "next-intl/server";
import { ContactForm } from "./contact-form";

const EMAIL = "lmfg10@gmail.com";

/**
 * Redes do componente antigo (`sections/contact-section.tsx`), com o handle
 * visível. Ele não é enfeite: o rodapé já linka GitHub e LinkedIn com o texto
 * `github` / `linkedin`, e dois links para o mesmo destino com o mesmo nome
 * acessível são ruído numa lista de links. Com o caminho completo os nomes
 * passam a ser distintos, e de quebra o endereço vira o dado — que é como um
 * terminal mostraria isso.
 */
const SOCIALS = [
  { key: "github", label: "github.com/LuisMFG", href: "https://github.com/LuisMFG" },
  {
    key: "linkedin",
    label: "linkedin.com/in/celodev11",
    href: "https://linkedin.com/in/celodev11",
  },
  {
    key: "instagram",
    label: "instagram.com/celo11_",
    href: "https://instagram.com/celo11_",
  },
] as const;

/**
 * Seção "contato". **Não existe no protótipo** — ele vai da seção de comando
 * direto ao rodapé. Derivada, como "sobre", "stack" e "experiência".
 *
 * Server component: o cabeçalho, a prosa e os canais não têm estado nenhum. O
 * único cliente é o `ContactForm`, e o porquê está lá.
 *
 * ### A régua de cima não é da seção — é da banda de comando
 *
 * `border-t` aqui parece fronteira de seção e não é. A seção de comando é
 * `--surface`, e até agora quem fechava a banda dela por baixo era o
 * `border-t` do rodapé. Inserir esta seção no meio deixaria aquela borda
 * órfã: a régua sobe para cá porque é aqui que o fundo volta de `--surface`
 * para `--bg`. Régua marca troca de superfície, não fronteira de seção — a
 * regra vale nos dois sentidos, não só na entrada da banda.
 *
 * ### A estrutura veio do componente antigo, e é isso que salva as 19 chaves
 *
 * `sections/contact-section.tsx` tinha duas colunas: à esquerda `getInTouch`
 * com a descrição, os canais e `followMe`; à direita `sendMessage` com o
 * formulário. Manter essa divisão é o que faz **todas as chaves traduzidas de
 * `ContactSection` continuarem sendo renderizadas** — nenhuma copy nova,
 * nenhuma chave nova em `messages/*.json`, nenhuma chave abandonada.
 *
 * `mail` no cabeçalho é jargão de terminal, como `stack`, `log` e o `exit 0`
 * do rodapé, e é a mesma palavra que o rodapé já usa para o link de e-mail.
 * A gramática `$ comando` vem do `$ whoami` da seção "sobre".
 *
 * ### Empréstimos
 *
 * - Cabeçalho de dois rótulos de 11px com `pb-projects-head`, da lista de
 *   projetos (`prototype.html:101`).
 * - Prosa em `text-body` / `max-w-about` (72ch), da seção "sobre".
 * - `<dl>` de canais em `max-content minmax(0, 1fr)` com `--project-gap` e
 *   `align-items: baseline`, da seção "stack" — inclusive o `display:
 *   contents` que alinha a coluna de rótulos entre os pares.
 * - Colchetes do botão, dos controles de tema e idioma do header.
 * - `[ok]` da linha de resultado, do status da lista de projetos.
 *
 * ### A localização **não** entra aqui
 *
 * A seção "sobre" fecha com um `<dl>` LOCALIZAÇÃO / `porto velho · ro`,
 * justamente porque o header esconde a localização abaixo de 768px. Repetir o
 * par aqui daria dois `<dl>` idênticos na mesma página. A chave
 * `ContactSection.location` continua sendo consumida — lá.
 *
 * Consequência registrada: o `"Rondônia, Brasil."` do componente antigo não
 * volta. Era literal cravado no JSX, nunca uma chave traduzida, e
 * `Header.location` é a versão canônica e mais precisa que a página já mostra
 * em dois lugares.
 *
 * ### Nenhuma entrada animada
 *
 * Mesma regra das outras quatro derivadas: o protótipo só anima o hero, e
 * entrada por scroll pede IntersectionObserver, que é a fase de movimento.
 *
 * ### Decisão de 375px: as duas colunas viram uma
 *
 * Colapso em `md` (768px), o mesmo de "stack" e "experiência", por media
 * query em `tokens.css` — nunca render condicional. Canais acima, formulário
 * abaixo. Dentro dos canais, o rótulo sobe sobre o valor:
 * `linkedin.com/in/celodev11` mede ~216px no piso da escala e não sobrevive à
 * coluna que sobraria ao lado de `ME SIGA`. Campos ocupam a linha inteira em
 * qualquer largura — dois campos lado a lado não caberiam nem na meia coluna
 * do desktop.
 *
 * ### Pendência registrada: `/api/contact` não tem proteção anti-spam
 *
 * Verificado: nenhum honeypot, nenhum rate limit, nenhum captcha na rota.
 * `src/lib/rate-limit.ts` existe e é consumido só pelo login do admin (5 por
 * 15 min). Não é escopo desta seção e **não foi inventado nada aqui** — fica
 * anotado para quando a rota for mexida.
 */
export async function ContactSection() {
  const t = await getTranslations("ContactSection");

  return (
    <section
      aria-labelledby="contact-title"
      className="relative z-10 border-t border-term-line px-gutter py-section"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-4 pb-projects-head text-label-wide uppercase text-term-muted">
        <h2 id="contact-title" className="font-normal">
          {t("title")}
        </h2>
        <span>
          <span aria-hidden="true">{"$ "}</span>
          mail
        </span>
      </div>

      <p className="max-w-about text-body text-term-text">{t("description")}</p>

      {/* `text-body` no contêiner: `--contact-col-gap` e os vãos do
          formulário são em `em` e resolvem contra a escala do corpo — mesma
          exigência da seção "experiência". */}
      <div data-contact-cols className="pt-about-meta text-body">
        <div>
          <h3 className="pb-projects-head text-label-wide font-normal uppercase text-term-muted">
            {t("getInTouch")}
          </h3>

          <dl data-contact-channels>
            <div data-contact-pair>
              <dt className="text-project-meta uppercase text-term-muted">
                {t("email")}
              </dt>
              <dd>
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex min-h-tap items-center text-term-text transition-colors duration-300 ease-term hover:text-term-accent focus-visible:text-term-accent"
                >
                  {EMAIL}
                </a>
              </dd>
            </div>

            <div data-contact-pair>
              <dt className="text-project-meta uppercase text-term-muted">
                {t("followMe")}
              </dt>
              <dd>
                {/* `role="list"`: `display: flex` no `<ul>` remove a
                    semântica de lista no VoiceOver, a mesma armadilha que a
                    seção "stack" já levou. */}
                <ul role="list" data-contact-links>
                  {SOCIALS.map(({ key, label, href }) => (
                    <li key={key}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-tap items-center text-term-text transition-colors duration-300 ease-term hover:text-term-accent focus-visible:text-term-accent"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="pb-projects-head text-label-wide font-normal uppercase text-term-muted">
            {t("sendMessage")}
          </h3>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
