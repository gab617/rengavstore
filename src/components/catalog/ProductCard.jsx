import { useEffect, useState } from "react";
import { publicUrl } from "../../lib/storefront";
import { formatPrice } from "../../lib/tienda";
import useCart from "../../hooks/useCart";
import AvailabilityBadge from "./AvailabilityBadge";
import SizeChips from "./SizeChips";
import SizePickerModal from "./SizePickerModal";

export default function ProductCard({ p, onOpen, theme }) {
  const imagenes = (p.imagenes || []).filter(Boolean);
  const [sel, setSel] = useState(0);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem, canAdd } = useCart();
  const img = imagenes[sel] ? publicUrl(imagenes[sel]) : null;
  const categoria = p.categoria?.nombre;
  const sub = p.subcategoria?.nombre;
  const hasSizes = p.talles?.length > 0;

  const primary = theme?.primary || "#2563eb";
  const accent = theme?.accent || "#db2777";
  const fondo = theme?.fondo || "#f9fafb";
  const texto = theme?.texto || "#111827";

  useEffect(() => {
    setSel(0);
  }, [p.id]);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1200);
    return () => clearTimeout(t);
  }, [added]);

  const handleAddToCart = () => {
    if (!canAdd(p)) return;
    if (hasSizes) {
      setShowSizePicker(true);
      return;
    }
    addItem(p, 1);
    setAdded(true);
  };

  return (
    <>
<article
        className="group relative flex overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:flex-col"
        style={{
          background: `linear-gradient(180deg, ${fondo} 0%, color-mix(in srgb, ${fondo} 92%, ${texto} 8%) 100%)`,
          color: texto,
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
          minHeight: "280px",
          border: `1px solid ${texto}15`,
        }}
      >
        <button
          onClick={onOpen}
          className="relative w-40 shrink-0 self-stretch overflow-hidden sm:w-full sm:aspect-[3/4] sm:self-auto"
          aria-label={`Ver ${p.nombre}`}
          style={{
            background: `linear-gradient(135deg, ${fondo} 0%, color-mix(in srgb, ${fondo} 85%, transparent) 100%)`,
          }}
        >
          {img ? (
            <img
              src={img}
              alt={p.nombre}
              loading="lazy"
              className="h-full w-full object-contain object-center sm:object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center" style={{ color: `${texto}40` }}>
              <svg
                className="h-8 w-8 sm:h-14 sm:w-14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
                <path d="M3 8l9 5 9-5" />
                <path d="M12 13v9" />
              </svg>
            </span>
          )}
        </button>

        {imagenes.length > 1 && (
          <div className="no-scrollbar hidden gap-1.5 overflow-x-auto px-3 pt-2 sm:flex">
            {imagenes.map((im, idx) => (
              <button
                key={`${im}-${idx}`}
                onClick={() => setSel(idx)}
                className={`h-8 w-8 shrink-0 overflow-hidden rounded-lg ring-2 transition-all ${
                  idx === sel
                    ? `ring-[${primary}] opacity-100`
                    : "ring-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={publicUrl(im)}
                  alt={`${p.nombre} ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col min-h-0 p-3 sm:p-4">
          {p.marca && (
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: `${texto}80` }}>
              {p.marca}
            </p>
          )}
          <h3 className="mt-0.5 font-medium leading-snug sm:line-clamp-2">
            {p.nombre}
          </h3>

          <div className="mt-2">
            {hasSizes ? (
              <SizeChips sizes={p.talles} />
            ) : (
              <AvailabilityBadge disponibilidad={p.disponibilidad} />
            )}
          </div>

          {(categoria || sub) && (
            <p className="mt-2 text-[11px] break-words" style={{ color: `${texto}60` }}>
              {[categoria, sub].filter(Boolean).join(" · ")}
            </p>
          )}

          <div className="mt-auto flex items-end justify-between gap-2 pt-3 sm:block">
            <span className="text-sm font-bold tabular-nums sm:text-lg">
              {formatPrice(p.precio_venta)}
            </span>
            <div className="flex flex-col gap-1.5 sm:mt-2.5 sm:flex-row sm:gap-2">
              <button
                onClick={onOpen}
                className="rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors hover:opacity-80 active:scale-[0.98] sm:flex-1 sm:rounded-xl sm:py-1.5 sm:text-[13px]"
                style={{
                  color: primary,
                  border: `1px solid ${primary}40`,
                  background: `${primary}0D`,
                }}
              >
                Ver detalle
              </button>
              {canAdd(p) && (
                <button
                  onClick={handleAddToCart}
                  className="rounded-lg px-2.5 py-1 text-[11px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.99] sm:flex-1 sm:rounded-xl sm:py-1.5 sm:text-[13px]"
                  style={{
                    background: `linear-gradient(135deg, ${primary} 0%, color-mix(in srgb, ${primary} 70%, #0f172a) 100%)`,
                    boxShadow: `0 4px 14px -4px ${primary}80`,
                  }}
                >
                  {added ? "Agregado ✓" : hasSizes ? "Elegir talle" : "Agregar"}
                </button>
              )}
            </div>
          </div>
        </div>
      </article>

      {showSizePicker && (
        <SizePickerModal p={p} onClose={() => setShowSizePicker(false)} />
      )}
    </>
  );
}