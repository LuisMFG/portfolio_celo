import type { Metadata } from "next";

export const metadata: Metadata = {
  // Staging: nenhum deploy pode indexar isso antes da promoção.
  robots: { index: false, follow: false },
};

/**
 * Shell do redesign, em staging até as seções serem portadas.
 *
 * Regras de scroll, decididas aqui e não na fase de movimento:
 * o `<body>` é quem rola. Nenhum `h-screen` + `overflow-y-auto` em wrapper,
 * nenhum `scroll-snap` — os dois quebrariam o Lenis (que assume `window`) e
 * o IntersectionObserver com `root: null`. A home antiga mantém o scroll
 * interno dentro do próprio HomeShell e não é afetada.
 *
 * `overflow-x: clip` fica no wrapper, não em `html`: `clip` recorta sem criar
 * contexto de scroll, enquanto `hidden` — que o protótipo usa por ser um
 * arquivo solto — transformaria o elemento em contêiner de scroll.
 */
export default function V2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theme-terminal relative min-h-svh [overflow-x:clip]">
      {children}
    </div>
  );
}
