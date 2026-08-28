import { useEffect, useState } from "react";
import { publicUrl } from "../../lib/storefront";
import { formatPrice } from "../../lib/tienda";
import useCart from "../../hooks/useCart";
import SizePickerModal from "./SizePickerModal";

export default function FeaturedCard({ p, onOpen, onSeeCategory, theme }) {
  const img = p.imagenes?.[0] ? publicUrl(p.imagenes[0]) : null;
  const categoria = p.categoria?.nombre;
  const tieneCta = Boolean(onSeeCategory && categoria);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem, canAdd } = useCart();
  const hasSizes = p.talles?.length > 0;

  const primary = theme?.primary || "#2563eb";

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1200);
    return () => clearTimeout(t);
  }, [added]);

  const handleAddToCart = (e) => {
    e.stopPropagation();
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
      <article className="group relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-black/5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gray-900/15">
        {canAdd(p) && (
          <button
            onClick={handleAddToCart}
            className="absolute right-2.5 top-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-all hover:scale-110 active:scale-95"
            aria-label={hasSizes ? "Elegir talle y agregar" : "Agregar al carrito"}
            style={{
              background: `linear-gradient(135deg, ${primary} 0%, color-mix(in srgb, ${primary} 70%, #0f172a) 100%)`,
              boxShadow: `0 4px 14px -4px ${primary}80`,
            }}
          >
            {added ? (
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                <path d="M12 9v6" />
                <path d="M9 12h6" />
              </svg>
            )}
          </button>
        )}

        <div
          onClick={onOpen}
          className="absolute inset-0 cursor-pointer"
          role="button"
        >
          {img ? (
            <img
              src={img}
              alt={p.nombre}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
              <svg
                className="h-10 w-10 text-gray-300"
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
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-3">
            <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-white/70">
              {p.marca || categoria || "Producto"}
            </p>
            <p className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-white">
              {p.nombre}
            </p>
            <p className="mt-1 text-sm font-bold tabular-nums text-white">
              {formatPrice(p.precio_venta)}
            </p>
            {tieneCta && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSeeCategory();
                }}
                className="mt-2 flex w-full items-center justify-between gap-1.5 rounded-xl py-1.5 pl-3 pr-2.5 text-[11px] font-bold shadow transition-colors"
                style={{
                  background: "white",
                  color: primary,
                  border: `1px solid ${primary}40`,
                }}
              >
                <span className="truncate">Ver más en {categoria}</span>
                <span aria-hidden>→</span>
              </button>
            )}
          </div>
        </div>
      </article>

      {showSizePicker && (
        <SizePickerModal p={p} onClose={() => setShowSizePicker(false)} />
      )}
    </>
  );
}