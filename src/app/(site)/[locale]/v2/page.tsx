import { setRequestLocale } from "next-intl/server";
import { fetchProjects, type Locale } from "@/src/lib/content";
import { BackgroundGrid } from "@/src/components/site/background-grid";
import { SiteHeader } from "@/src/components/site/site-header";
import { SiteFooter } from "@/src/components/site/site-footer";
import { HeroSection } from "@/src/components/site/hero-section";
import { MarqueeSection } from "@/src/components/site/marquee-section";
import { AboutSection } from "@/src/components/site/about-section";
import { StackSection } from "@/src/components/site/stack-section";
import { ProjectsSection } from "@/src/components/site/projects-section";
import { CommandSection } from "@/src/components/site/command-section";

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

  const projects = await fetchProjects(locale as Locale);

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

          A faixa é `aria-hidden` desde que a seção "stack" passou a listar as
          mesmas doze tecnologias — o porquê está no docblock dela. Isso a tira
          da árvore de acessibilidade, então a questão de landmark não se
          aplica a ela. **Vale para todas as outras:** um `<section>` fora do
          `<main>` só é landmark `region` se tiver nome acessível. Nome ou
          nada de landmark — e a faixa escolheu nada, de propósito. */}
      <MarqueeSection />

      {/* Derivada, não portada: o protótipo não tem seção de prosa. Fica
          entre a faixa e a lista porque o marquee é a banda que fecha a
          primeira tela, e porque "sobre" responde ao `whoami` do hero antes
          de o trabalho ser listado.

          Mesmo requisito estrutural das outras: fora do `<main>`, e landmark
          `region` pelo `aria-labelledby` no `<h2>` do cabeçalho. Também é
          quem carrega `porto velho · ro` abaixo de 768px, onde o header a
          esconde — consequência registrada daquela decisão, não opcional. */}
      <AboutSection />

      {/* Derivada como a de cima. Fica entre "sobre" e "projetos" na ordem do
          site antigo — quem eu sou, o que eu uso, o que eu construí.

          É ela que tornou a faixa `aria-hidden`: as doze tecnologias vivem
          aqui agora, com nome de região vindo do `<h2>`, e a faixa deixou de
          duplicá-las na árvore de acessibilidade. Nenhuma régua a separa de
          "sobre" nem de "projetos" — as três dividem o mesmo `--bg`, e régua
          marca troca de superfície, não fronteira de seção. */}
      <StackSection />

      {/* Também fora do `<main>`, pelo mesmo motivo da faixa — e com o mesmo
          requisito: `aria-labelledby` no `<section>` a torna landmark
          `region`, com o `<h2>` do cabeçalho como nome. */}
      <ProjectsSection projects={projects} />

      {/* Mesma regra das duas de cima: fora do `<main>`, e landmark `region`
          pelo `aria-labelledby` no `<h2>` do rótulo. É a primeira seção com
          JavaScript de cliente — a digitação vive dentro do `TypedCommand`,
          não aqui. */}
      <CommandSection />

      <SiteFooter />
    </>
  );
}
