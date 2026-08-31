import { setRequestLocale } from "next-intl/server";
import { BackgroundGrid } from "@/src/components/site/background-grid";
import { SiteHeader } from "@/src/components/site/site-header";
import { SiteFooter } from "@/src/components/site/site-footer";
import { HeroSection } from "@/src/components/site/hero-section";
import { MarqueeSection } from "@/src/components/site/marquee-section";

/**
 * Página de staging do redesign. As seções de conteúdo entram no `<main>`,
 * uma a uma, abaixo do hero.
 *
 * O shell da primeira tela é só `min-h-svh` + coluna flex: gutter e padding
 * pertencem a cada seção, não ao shell, senão o marquee — que sangra de
 * ponta a ponta — teria que desfazer o padding do pai com margem negativa.
 *
 * O `<header>` fica fora do `<main>` para continuar sendo landmark `banner`,
 * mas dentro do shell, para dividir a coluna flex com o hero como na section
 * de 100vh do protótipo.
 */
export default async function V2Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <div className="relative flex min-h-svh flex-col">
        <BackgroundGrid />
        <SiteHeader />

        {/* `<main>` é obrigatório: sem ele o Lighthouse acusa
            "Document does not have a main landmark". */}
        <main id="content" className="relative z-10 flex flex-1 flex-col">
          <HeroSection />
        </main>
      </div>

      {/* Fora do `min-h-svh`, não dentro: o hero é `flex-1` daquele shell, e
          qualquer irmão dentro dele roubaria altura do hero até a faixa subir
          para dentro da primeira tela. Isso força ficar fora do `<main>`
          também — o `<main>` mora dentro do shell para dividir a coluna flex
          com o header, que por sua vez precisa ficar fora dele para continuar
          sendo landmark `banner`, e tags não se sobrepõem.

          Ficar fora do `<main>` não deixa a faixa fora de landmark: um
          `<section>` com nome acessível é ele próprio um landmark `region`, e
          é por isso que o `aria-label` do marquee é requisito estrutural, não
          enfeite. Toda seção que entrar aqui embaixo precisa do mesmo — nome
          acessível ou nada de landmark. */}
      <MarqueeSection />

      <SiteFooter />
    </>
  );
}
