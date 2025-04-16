import './globals.css';
import type { Metadata } from 'next';
import { Sora } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '600', '700'], 
})

export const metadata: Metadata = {
  title: 'Luis Marcelo - Desenvolvedor Full Stack',
  description: 'Portfolio pessoal de Luis Marcelo, Desenvolvedor Full Stack',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={sora.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}