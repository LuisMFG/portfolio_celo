import { setRequestLocale } from "next-intl/server";
import { Sora } from "next/font/google";
import { fetchExperiences, fetchProjects, type Locale } from "@/src/lib/content";
import { HomeShell } from "@/src/components/home-shell";

/**
 * A Sora é da home antiga, não do site. Fica aqui — e não no layout de
 * locale — para que o /v2 não baixe nem precarregue uma fonte que não
 * desenha. Some junto com esta página na promoção do redesign.
 */
const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [experiences, projects] = await Promise.all([
    fetchExperiences(locale as Locale),
    fetchProjects(locale as Locale),
  ]);

  return (
    <div className={sora.className}>
      <HomeShell experiences={experiences} projects={projects} />
    </div>
  );
}
