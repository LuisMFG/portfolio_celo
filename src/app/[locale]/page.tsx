import { setRequestLocale } from "next-intl/server";
import { fetchExperiences, fetchProjects, type Locale } from "@/src/lib/content";
import { HomeShell } from "@/src/components/home-shell";

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

  return <HomeShell experiences={experiences} projects={projects} />;
}
