import { useMemo } from "react";
import ProductGrid from "./ProductGrid";

const LABEL_NONE = "Sin categoría";

export default function CategorySections({ productos, onOpen, theme }) {
  const grupos = useMemo(() => {
    const map = new Map();
    for (const p of productos) {
      const key = p.categoria?.id ?? "none";
      const nombre = p.categoria?.nombre ?? LABEL_NONE;
      if (!map.has(key)) map.set(key, { key, nombre, items: [] });
      map.get(key).items.push(p);
    }
    return [...map.values()].sort((a, b) =>
      a.nombre.localeCompare(b.nombre, "es")
    );
  }, [productos]);

  return (
    <div>
      {grupos.map((g, i) => (
        <section key={g.key} aria-labelledby={`cat-${g.key}`} className={i > 0 ? "mt-10" : ""}>
          {i > 0 && (
            <div
              aria-hidden
              className="mx-auto mb-6 h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, var(--color-borde) 15%, var(--color-borde) 85%, transparent 100%)",
              }}
            />
          )}
          <header className="mb-4 flex items-center gap-3">
            <span
              aria-hidden
              className="h-6 w-1 shrink-0 rounded-full"
              style={{
                background:
                  "linear-gradient(180deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-primary) 40%, transparent) 100%)",
              }}
            />
            <h2
              id={`cat-${g.key}`}
              className="font-display text-lg sm:text-xl font-semibold tracking-tight text-[var(--color-texto)]"
            >
              {g.nombre}
            </h2>
            <span
              className="rounded-full px-2.5 py-0.5 text-[11px] font-bold tabular-nums"
              style={{
                background: "var(--color-primary)",
                color: "var(--color-primary-texto)",
              }}
            >
              {g.items.length}
            </span>
          </header>
          <ProductGrid productos={g.items} onOpen={onOpen} theme={theme} />
        </section>
      ))}
    </div>
  );
}