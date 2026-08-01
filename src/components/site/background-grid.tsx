/**
 * Grid de 12 colunas do protótipo (`prototype.html:46-59`).
 *
 * Sem `opacity`: a cor efetiva vive no token `--grid`, para que `--line`
 * fique livre para desenhar bordas em opacidade cheia.
 *
 * Server component — nenhum estado, nenhum JS no cliente.
 */
export function BackgroundGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 grid grid-cols-12"
    >
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          className={
            i === 11
              ? "border-l border-r border-term-grid"
              : "border-l border-term-grid"
          }
        />
      ))}
    </div>
  );
}
