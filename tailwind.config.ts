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
        marquee: ['clamp(1.4rem,4vw,3.4rem)', { letterSpacing: '-0.03em' }],
        lead: ['clamp(.8rem,1.1vw,1rem)', { letterSpacing: '.24em' }],
        label: ['11px', { letterSpacing: '.18em' }],
        'label-wide': ['11px', { letterSpacing: '.2em' }],
      },
      spacing: {
        gutter: 'clamp(20px,3vw,44px)',
        section: 'clamp(64px,9vw,140px)',
        'section-lg': 'clamp(70px,11vw,180px)',
      },
      transitionTimingFunction: {
        term: 'var(--ease)',
      },
      // Tailwind 3.3.3 não tem `min-h-svh` nem a escala de spacing em
      // minHeight/minWidth (ambos chegaram na 3.4). Entram como token para
      // que nenhum componente precise de valor arbitrário.
      minHeight: {
        // Alvo de toque de 44px sem inflar os 11px da fonte.
        tap: '44px',
        // svh, não vh: barra fantasma no Safari iOS.
        svh: '100svh',
      },
      minWidth: {
        tap: '44px',
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
