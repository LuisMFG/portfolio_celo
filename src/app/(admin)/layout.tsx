import "../globals.css";
import { Sora } from "next/font/google";
import { ThemeProvider } from "@/src/components/theme-provider";
import { Toaster } from "@/src/components/ui/toaster";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

/**
 * Root layout do painel admin. Separado do site público para que os tokens
 * do "Dev Terminal" e a JetBrains Mono não vazem para cá — o admin continua
 * no shadcn, em Sora.
 */
export default function AdminRootLayout({
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
