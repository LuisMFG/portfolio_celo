import { setRequestLocale } from "next-intl/server";
import { BackgroundGrid } from "@/src/components/site/background-grid";
import { SiteHeader } from "@/src/components/site/site-header";
import { SiteFooter } from "@/src/components/site/site-footer";

/**
 * Página de staging da fundação. Só o chão: grid, header e footer.
 * As seções de conteúdo entram aqui uma a uma.
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
      <div className="relative flex min-h-svh flex-col px-gutter pb-8 pt-7">
        <BackgroundGrid />
        <SiteHeader />

        <div className="relative z-10 flex flex-1 items-center">
          <p className="text-label-wide uppercase text-term-muted">
            fundação · aguardando seções
          </p>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
