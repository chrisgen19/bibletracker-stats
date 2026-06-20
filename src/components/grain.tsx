/**
 * Full-viewport film-grain overlay that gives surfaces a subtle paper tooth.
 * Opacity is driven by the --grain-opacity token so it adapts per theme.
 */
const NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 mix-blend-multiply dark:mix-blend-soft-light"
      style={{
        opacity: "var(--grain-opacity)",
        backgroundImage: `url("${NOISE}")`,
        backgroundSize: "200px 200px",
      }}
    />
  );
}
