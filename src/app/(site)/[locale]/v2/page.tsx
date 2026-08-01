import { setRequestLocale } from "next-intl/server";
import { BackgroundGrid } from "@/src/components/site/background-grid";
import { SiteHeader } from "@/src/components/site/site-header";
import { SiteFooter } from "@/src/components/site/site-footer";
import { HeroSection } from "@/src/components/site/hero-section";

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

      <SiteFooter />
    </>
  );
}
