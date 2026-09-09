/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: [
   
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      // Escala do protótipo "Dev Terminal". Os clamp() são os valores exatos
      // de CLAUDE.md — nenhum componente deve reescrevê-los.
      fontSize: {
        display: [
          'clamp(3.5rem,13vw,15rem)',
          { letterSpacing: '-0.04em', lineHeight: '0.9' },
        ],
        project: [
          'clamp(1.3rem,3.4vw,2.9rem)',
          { letterSpacing: '-0.035em', lineHeight: '1' },
        ],
        // `lineHeight: normal` é o default do protótipo dito em voz alta: o
        // preflight do Tailwind põe `line-height: 1.5` no `html`, herdado até
        // a faixa, e 1.5 × 54.4px engordava a banda em 10.6px contra os 141px
        // do protótipo. Entrelinha de display se mede pela métrica da fonte.
        marquee: [
          'clamp(1.4rem,4vw,3.4rem)',
          { letterSpacing: '-0.03em', lineHeight: 'normal' },
        ],
        lead: ['clamp(.8rem,1.1vw,1rem)', { letterSpacing: '.24em' }],
        // A linha de prompt é meio degrau maior que a lead e não tem
        // tracking — é código, não label (prototype.html:80).
        prompt: ['clamp(.8rem,1.15vw,1rem)', { letterSpacing: '0' }],
        label: ['11px', { letterSpacing: '.18em' }],
        'label-wide': ['11px', { letterSpacing: '.2em' }],
        // Meta da linha de projeto — índice, pilha e status
        // (prototype.html:108-111). Mesmos 11px dos outros rótulos, tracking
        // menor: dentro da linha o texto compete com o nome ao lado, e .18em
        // alargaria a pilha de tecnologias sem ganho de leitura.
        'project-meta': ['11px', { letterSpacing: '.14em' }],
        // Linha de terminal digitada (prototype.html:142). Escala própria:
        // é maior que o prompt do hero — aqui a linha é o conteúdo da seção,
        // não a assinatura de rodapé de tela.
        command: [
          'clamp(1rem,3.2vw,2.6rem)',
          { letterSpacing: '-0.03em', lineHeight: '1.2' },
        ],
        // Corpo de leitura da seção "sobre" — a escala que o protótipo não
        // tem. Meio degrau acima do `prompt` e bem abaixo do `command`: a
        // prosa não pode competir com a linha digitada. Tracking `0` como o
        // `prompt`, porque o negativo do protótipo é de display.
        //
        // `lineHeight` vem de `tokens.css` porque o vão entre parágrafos
        // deriva do mesmo número — mesma razão do `spacing.gutter`.
        body: [
          'clamp(0.9rem,1.35vw,1.2rem)',
          { letterSpacing: '0', lineHeight: 'var(--body-leading)' },
        ],
      },
      spacing: {
        // Definido em `tokens.css`: regras de lá também consomem o gutter, e
        // duas cópias do mesmo clamp seriam duas verdades.
        gutter: 'var(--gutter)',
        section: 'clamp(64px,9vw,140px)',
        'section-lg': 'clamp(70px,11vw,180px)',
        // Respiro do bloco de nome dentro da primeira tela
        // (prototype.html:67) — assimétrico de propósito: o miolo desce 2vh.
        'hero-top': '6vh',
        'hero-bottom': '2vh',
        // Entre o display e a linha de apoio (prototype.html:74).
        'hero-lead': 'clamp(18px,2.5vw,34px)',
        // Altura da barra do indicador de scroll (prototype.html:88).
        hint: '34px',
        // Faixa do marquee (prototype.html:93) — 2.4vw, não os 2.5vw de
        // `hero-lead`. Valores próximos, escalas diferentes.
        marquee: 'clamp(18px,2.4vw,34px)',
        // Respiro de cada lado do `·` que separa as tecnologias
        // (prototype.html:95). Em `em` de propósito: acompanha o clamp da
        // fonte do marquee em vez de virar um vão fixo no mobile.
        'marquee-sep': '0.45em',
        // Entre o cabeçalho da lista de projetos e a primeira linha
        // (prototype.html:101). Fixo no protótipo, não um clamp.
        'projects-head': '22px',
        // Entre o rótulo `session · stdin` e a linha digitada
        // (prototype.html:141). Fixo no protótipo, não um clamp.
        'command-head': '26px',
        // Entre parágrafos da seção "sobre": uma linha do corpo, definida em
        // `tokens.css`. Em `em`, então resolve contra o `text-body` do
        // contêiner e acompanha o clamp da fonte em vez de virar vão fixo.
        'about-para': 'var(--about-para-gap)',
        // Ar de cada lado da régua que fecha a seção "sobre". Simétrico e com
        // clamp próprio: o vão entre parágrafos é ritmo de prosa e seria
        // pouco para separar prosa de dado.
        'about-meta': 'clamp(30px,3.4vw,48px)',
      },
      height: {
        // O grid pertence à primeira tela, não ao documento: o shell cresce
        // quando novas seções entram, o grid não. Tailwind 3.3.3 não tem svh.
        svh: '100svh',
      },
      transitionTimingFunction: {
        term: 'var(--ease)',
      },
      // Tailwind 3.3.3 não tem `min-h-svh` nem a escala de spacing em
      // minHeight/minWidth (ambos chegaram na 3.4). Entram como token para
      // que nenhum componente precise de valor arbitrário.
      minHeight: {
        // Piso de uma linha para a linha digitada (prototype.html:142). Sem
        // ele a caixa teria altura zero antes do primeiro caractere; com o
        // fantasma do TypedCommand ele só governa quando o texto cabe numa
        // linha, que é o caso de 768px para cima.
        command: '1.3em',
        // Alvo de toque de 44px sem inflar os 11px da fonte.
        tap: '44px',
        // svh, não vh: barra fantasma no Safari iOS.
        svh: '100svh',
      },
      minWidth: {
        tap: '44px',
      },
      maxWidth: {
        // Medida da prosa da seção "sobre" — 72 colunas, definidas em
        // `tokens.css`. Em `ch`, a unidade nativa do conceito: em
        // monoespaçada `ch` é literalmente coluna.
        about: 'var(--about-measure)',
        // Medida da descrição de cada experiência. Apelido de `--about-measure`
        // em `tokens.css`: mesmo tipo de texto, mesma largura de leitura.
        exp: 'var(--exp-measure)',
      },
      colors: {
        // Namespace próprio: `muted` e `accent` já pertencem ao shadcn e são
        // triplas HSL. Usar as mesmas chaves quebraria o admin.
        term: {
          bg: 'var(--bg)',
          surface: 'var(--surface)',
          line: 'var(--line)',
          grid: 'var(--grid)',
          text: 'var(--text)',
          muted: 'var(--muted)',
          accent: 'var(--accent)',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [animate],
};

export default config;
