export default function SizeChips({ sizes = [], selected, onSelect }) {
  if (!sizes?.length) return null;

  const selectable = typeof onSelect === "function";
  const count = sizes.length;
  // Ancho igual para todos: 100% / count, con min y max razonables
  const chipWidth = `calc((100% - ${(count - 1) * 4}px) / ${count})`;

  return (
    <div className="flex flex-wrap gap-1 w-full" style={{ minWidth: 0 }}>
      {sizes.map((s) => {
        const outOfStock = s.stock === 0;
        const lowStock = s.stock > 0 && s.stock <= 5;
        const isSelected = selectable && selected === s.nombre;

        const dotCls = outOfStock
          ? "bg-red-400"
          : lowStock
            ? "bg-amber-400"
            : "bg-green-500";

        const textCls = outOfStock
          ? "text-red-400"
          : lowStock
            ? "text-amber-500"
            : "text-green-600";

        const hoverTextCls = selectable && isSelected ? "text-[var(--color-primary-texto)]" : textCls;
        const statusLabel = outOfStock ? "Sin stock" : lowStock ? "¡Quedan pocas!" : "Disponible";

        const chipCls = selectable
          ? `group relative rounded border px-1 py-1.5 text-center text-[10px] sm:text-xs transition-all ${
              isSelected
                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 ring-1 ring-[var(--color-primary)]"
                : outOfStock
                  ? "border-[var(--color-borde)] surface-soft opacity-40 cursor-not-allowed"
                  : "border-[var(--color-borde)] surface-soft cursor-pointer hover:border-[var(--color-texto)]/40"
            }`
          : "group relative rounded border border-[var(--color-borde)] surface-soft px-1 py-1.5 text-center text-[10px] sm:text-xs";

        const Tag = selectable && !outOfStock ? "button" : "span";

        return (
          <Tag
            key={s.id}
            type={Tag === "button" ? "button" : undefined}
            onClick={Tag === "button" ? () => onSelect(s.nombre) : undefined}
            className={chipCls}
            style={{
              width: chipWidth,
              minWidth: "2rem",
              maxWidth: "4rem",
              flexShrink: 0,
              flexGrow: 0,
            }}
          >
            <div className="flex flex-col items-center gap-0.5">
              <span className="font-medium text-[var(--color-secondary)] leading-none">{s.nombre}</span>
              <span className={`relative flex h-3.5 w-full items-center justify-center leading-none ${textCls}`}>
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${dotCls} ${
                    outOfStock ? "opacity-60" : "sm:group-hover:scale-0 sm:group-hover:opacity-0"
                  } ${lowStock || outOfStock ? "hidden sm:block" : "block"}`}
                />
                <span
                  className={`absolute inset-0 flex items-center justify-center text-[8.5px] font-semibold tracking-tight whitespace-nowrap transition-all duration-200 sm:text-[9px] ${
                    outOfStock
                      ? "opacity-100"
                      : lowStock
                        ? `${hoverTextCls} opacity-100 scale-100 sm:opacity-0 sm:scale-75 sm:group-hover:scale-100 sm:group-hover:opacity-100`
                        : `opacity-0 scale-75 ${hoverTextCls} group-hover:scale-100 group-hover:opacity-100`
                  }`}
                >
                  {statusLabel}
                </span>
              </span>
            </div>
          </Tag>
        );
      })}
    </div>
  );
}