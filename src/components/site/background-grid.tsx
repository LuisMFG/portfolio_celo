/**
 * Grid de 12 colunas do protótipo (`prototype.html:46-59`).
 *
 * Sem `opacity`: a cor efetiva vive no token `--grid`, para que `--line`
 * fique livre para desenhar bordas em opacidade cheia.
 *
 * Altura fixa de uma tela (`h-svh`), não `inset-0`: no protótipo o grid
 * pertence à section do hero, que mede 100vh. Ancorado ao topo do shell, ele
 * cobre header e hero e para ali — do contrário se esticaria por todo o
 * documento conforme as próximas seções entrarem.
 *
 * Server component — nenhum estado, nenhum JS no cliente.
 */
export function BackgroundGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-0 grid h-svh grid-cols-12"
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
