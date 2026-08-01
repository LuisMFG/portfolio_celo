import localFont from "next/font/local";

/**
 * JetBrains Mono — apenas os três pesos usados pelo protótipo.
 * Expõe `--font-mono`; declarar a variável não aplica a fonte.
 * Quem aplica é o `font-family` do wrapper do site.
 */
export const jetbrainsMono = localFont({
  src: [
    { path: "../fonts/JetBrainsMono-Light.woff2", weight: "300", style: "normal" },
    { path: "../fonts/JetBrainsMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/JetBrainsMono-Medium.woff2", weight: "500", style: "normal" },
  ],
  display: "swap",
  variable: "--font-mono",
});
