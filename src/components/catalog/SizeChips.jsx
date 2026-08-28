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
        const isSelected = selectable && selected === s.nombre;

        const colorCls = outOfStock
          ? "text-red-500"
          : s.stock <= 5
            ? "text-amber-500"
            : "text-green-700";

        const chipCls = selectable
          ? `rounded border px-1 py-1.5 text-center text-[10px] sm:text-xs transition-all ${
              isSelected
                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 ring-1 ring-[var(--color-primary)]"
                : outOfStock
                  ? "border-gray-200 bg-gray-50 opacity-40 cursor-not-allowed"
                  : "border-gray-200 bg-gray-50 cursor-pointer hover:border-gray-400"
            }`
          : "rounded border border-gray-200 bg-gray-50 px-1 py-1.5 text-center text-[10px] sm:text-xs";

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
              <span className="font-medium text-gray-500 leading-none">{s.nombre}</span>
              <strong className={`${colorCls} leading-none`}>{s.stock}</strong>
            </div>
          </Tag>
        );
      })}
    </div>
  );
}