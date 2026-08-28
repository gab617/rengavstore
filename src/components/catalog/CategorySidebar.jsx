export default function CategorySidebar({
  categorias,
  categoria,
  setCategoria,
  total,
}) {
  const countCls =
    "text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0";

  const row = (active) =>
    `w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl text-sm transition-all ${
      active ? "text-white shadow-lg" : "text-gray-600 hover:bg-white hover:shadow-sm"
    }`;

  const activeStyle = {
    background: "var(--color-primary)",
    boxShadow: "0 8px 20px -10px var(--color-primary)",
  };

  return (
    <aside className="hidden md:block w-60 shrink-0">
      <div className="sticky top-4 space-y-0.5">
        <h2 className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400">
          Categorías
        </h2>
        <button
          onClick={() => setCategoria(null)}
          className={row(categoria === null)}
          style={categoria === null ? activeStyle : undefined}
        >
          <span className="font-medium">Todas</span>
          <span
            className={countCls}
            style={
              categoria === null
                ? { background: "rgba(255,255,255,0.22)" }
                : { background: "var(--color-primary)" , color: "#fff" }
            }
          >
            {total}
          </span>
        </button>
        {categorias.map((c) => {
          const active = categoria === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setCategoria(c.id)}
              className={row(active)}
              style={active ? activeStyle : undefined}
            >
              <span className="truncate font-medium">{c.nombre}</span>
              <span
                className={countCls}
                style={
                  active
                    ? { background: "rgba(255,255,255,0.22)" }
                    : { background: "var(--color-primary)", color: "#fff" }
                }
              >
                {c.count}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}