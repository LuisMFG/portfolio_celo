"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

// `error` e `network` são estados distintos de propósito: um é o servidor
// recusando, o outro é a resposta nunca ter chegado. Eles desenham igual mas
// dizem coisas diferentes, e cada um tem sua chave já traduzida.
type FormStatus = "idle" | "loading" | "success" | "error" | "network";

const FIELDS = [
  { name: "name", type: "text" },
  { name: "email", type: "email" },
  { name: "subject", type: "text" },
  { name: "message", type: "textarea" },
] as const;

type FieldName = (typeof FIELDS)[number]["name"];

const EMPTY: Record<FieldName, string> = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

/**
 * Formulário de contato. **Único componente de cliente da seção**, e o porquê
 * é direto: quatro campos controlados (`useState`), uma máquina de estado de
 * envio e um `fetch` no `submit`. Nada disso existe no servidor.
 *
 * Sem biblioteca nenhuma — nem framer-motion (que o componente antigo usava
 * em cada campo), nem lib de formulário, nem lib de validação no cliente. O
 * custo sobre o React que a rota já carrega é `useState` mais um `fetch`.
 *
 * ### A rota é a autoridade única de validação, e o cliente não tem opinião
 *
 * `/api/contact` já existe e valida à mão: campos obrigatórios, um
 * `emailRegex` local e truncagem silenciosa para 100/200/2000 caracteres.
 * **Ela não usa `src/lib/validators.ts`** — não há schema de contato lá para
 * reusar, então não há o que compartilhar.
 *
 * A consequência é deliberada: o cliente **não valida nada por conta
 * própria**. Só `required` e `type="email"` nativos, que o navegador aplica
 * antes do submit. Em particular **não existe `maxLength` nos campos** —
 * seria uma segunda cópia de 100/200/2000 vivendo longe da rota, exatamente
 * a divergência que "uma das duas está errada e ninguém sabe qual" descreve.
 * Quem trunca é o servidor, sozinho.
 *
 * ### O texto de erro do servidor não é exibido
 *
 * A rota responde `{ error }` com string **em português apenas** ("Erro
 * interno do servidor", "Email inválido"). O componente antigo a jogava na
 * tela com `data.error || t(...)`, o que mostrava português a quem lê o site
 * em inglês. Aqui o corpo da resposta não é exibido: falha de resposta usa
 * `form.errorDefault` e falha de rede usa `form.errorUnknown`, as duas
 * traduzidas. Detalhe do erro continua no log do servidor, que é onde ele
 * serve para alguma coisa.
 *
 * ### Envio duplo é impedido em duas camadas
 *
 * O `disabled` do botão é a camada visível; o guard no topo do `handleSubmit`
 * é a que sobrevive a um `requestSubmit()` por teclado ou a um duplo-clique
 * que chega antes do re-render. Uma só não basta.
 *
 * ### Feedback é log inline, nunca toast
 *
 * Sucesso e erro são duas linhas de saída logo abaixo do botão, na gramática
 * do terminal: `[ok]` para sucesso (o mesmo glifo e o mesmo `--accent` do
 * status da lista de projetos) e `stderr:` para erro.
 *
 * **Erro não é vermelho.** "Um único acento em todo o site" é regra dura do
 * projeto e não existe cor de status separada — o que distingue os dois
 * estados é o token textual, não a cor, que é o que a WCAG 1.4.1 pede de
 * qualquer forma. O `stderr:` fica em `--muted` e a mensagem em `--text`,
 * então o erro se lê em contraste cheio.
 *
 * Sucesso vai em `role="status"` (polite) e erro em `role="alert"`
 * (assertive). As duas regiões existem no DOM vazias desde o primeiro render
 * — região viva criada só na hora do erro corre o risco de não ter sido
 * registrada pelo leitor de tela a tempo de anunciar o primeiro conteúdo.
 */
export function ContactForm() {
  const t = useTranslations("ContactSection");

  const [values, setValues] = useState<Record<FieldName, string>>(EMPTY);
  const [status, setStatus] = useState<FormStatus>("idle");

  const busy = status === "loading";
  // `success` também trava: reenviar a mesma mensagem logo após o "enviado"
  // é quase sempre um duplo-clique, não uma segunda mensagem.
  const locked = busy || status === "success";

  function handleChange(name: FieldName, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Sai do erro assim que o usuário mexe em algo: a linha de `stderr`
    // descrevia a tentativa anterior, não o que está na tela agora.
    if (status === "error" || status === "network") setStatus("idle");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Guard, não redundância: o `disabled` do botão não cobre `requestSubmit()`
    // nem um segundo clique que chegue antes do re-render.
    if (locked) return;

    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      setValues(EMPTY);
      setStatus("success");
    } catch {
      // Rede caiu, requisição abortada: a resposta nunca chegou, e o motivo
      // é diferente de "o servidor recusou". Chave própria, já traduzida.
      setStatus("network");
    }
  }

  const failed = status === "error" || status === "network";

  const buttonLabel = busy
    ? t("form.sending")
    : status === "success"
      ? t("form.success")
      : failed
        ? t("form.tryAgain")
        : t("form.submit");

  return (
    <form onSubmit={handleSubmit}>
      <div data-contact-form>
        {FIELDS.map((field) => {
          const id = `contact-${field.name}`;
          const label = t(`form.${field.name}`);
          const placeholder = t(`form.${field.name}Placeholder`);

          return (
            <div key={field.name} data-contact-field>
              <label
                htmlFor={id}
                className="text-project-meta uppercase text-term-muted"
              >
                {/* Ornamento de prompt: fora da árvore, então o nome
                    acessível do campo é só o rótulo. Placeholder não
                    substitui `<label>` — os dois existem. */}
                <span aria-hidden="true">{"> "}</span>
                {label}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  id={id}
                  name={field.name}
                  rows={6}
                  required
                  disabled={locked}
                  value={values[field.name]}
                  placeholder={placeholder}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  data-contact-input
                  className="text-field"
                />
              ) : (
                <input
                  id={id}
                  name={field.name}
                  type={field.type}
                  required
                  disabled={locked}
                  value={values[field.name]}
                  placeholder={placeholder}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  data-contact-input
                  className="min-h-tap text-field"
                />
              )}
            </div>
          );
        })}
      </div>

      <div data-contact-actions>
        {/* Colchetes são a gramática dos controles de tema e idioma do
            header. `aria-hidden` neles pelo mesmo motivo do `>`: o nome
            acessível do botão é o rótulo, que muda com o estado e nunca
            desaparece — nem no envio, onde ele diz "Enviando...". */}
        <button
          type="submit"
          disabled={locked}
          aria-busy={busy}
          className="inline-flex min-h-tap items-center text-label uppercase text-term-text transition-colors duration-300 ease-term hover:text-term-accent focus-visible:text-term-accent disabled:text-term-muted"
        >
          {/* `\u00a0`, não um espaço comum: o botão é `inline-flex` e flex
              descarta o espaço das pontas de cada nó de texto — com espaço
              normal os colchetes saem colados no rótulo. O nbsp faz parte do
              ornamento, e como os dois `<span>` são `aria-hidden` ele não
              entra no nome acessível do botão. */}
          <span aria-hidden="true" className="text-term-muted">
            {"[\u00a0"}
          </span>
          {buttonLabel}
          <span aria-hidden="true" className="text-term-muted">
            {"\u00a0]"}
          </span>
        </button>

        <p
          role="status"
          data-contact-result
          className="text-project-meta uppercase text-term-text"
        >
          {status === "success" ? (
            <>
              <span className="text-term-accent">[ok]</span>{" "}
              {t("form.successMessage")}
            </>
          ) : null}
        </p>

        <p
          role="alert"
          data-contact-result
          className="text-project-meta uppercase text-term-text"
        >
          {failed ? (
            <>
              <span className="text-term-muted">stderr:</span>{" "}
              {status === "network"
                ? t("form.errorUnknown")
                : t("form.errorDefault")}
            </>
          ) : null}
        </p>
      </div>
    </form>
  );
}
