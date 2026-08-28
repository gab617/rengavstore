import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useCart from "../../hooks/useCart";
import { publicUrl } from "../../lib/storefront";
import { formatPrice } from "../../lib/tienda";

export default function SizePickerModal({ p, onClose }) {
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const { addItem, canAdd } = useCart();

  const sizes = p.talles || [];
  const subtotal = (p.precio_venta || 0) * qty;
  const img = p.imagenes?.[0] ? publicUrl(p.imagenes[0]) : null;
  const primaryColor = "var(--color-primary, #2563eb)";

  useEffect(() => {
    setSelected(null);
    setQty(1);
    setError(false);
    setAdded(false);
    setIsExiting(false);
  }, [p.id]);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(), 300);
    }, 1000);
    return () => clearTimeout(t);
  }, [added, onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape" && !added) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, added]);

  const handleAdd = () => {
    if (!selected) {
      setError(true);
      return;
    }
    addItem(p, qty, selected);
    setAdded(true);
  };

  if (!canAdd(p)) return null;

  const containerStyle = {
    opacity: isExiting ? 0 : 1,
    transform: isExiting ? "scale(0.95)" : "scale(1)",
    transition: "opacity 250ms ease, transform 250ms ease",
  };

  const modalStyle = {
    opacity: isExiting ? 0 : 1,
    transform: isExiting ? "translateY(12px) scale(0.97)" : "translateY(0) scale(1)",
    transition: "opacity 250ms ease, transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
  };

  return createPortal(
    <div
      style={containerStyle}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !added) onClose();
      }}
    >
      <div
        style={modalStyle}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent bar */}
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(90deg, ${primaryColor}15, ${primaryColor}40, ${primaryColor}15)`,
          }}
        />

        <div className="px-5 pt-5 pb-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                Seleccionar talle
              </p>
              <p className="mt-1 text-base font-semibold text-gray-900 leading-snug">
                {p.nombre}
              </p>
              {p.marca && (
                <p className="mt-0.5 text-sm font-medium text-gray-500">
                  {p.marca}
                </p>
              )}
            </div>
            <button
              onClick={() => !added && onClose()}
              disabled={added}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-900 active:scale-95 disabled:opacity-40 disabled:hover:bg-transparent"
              aria-label="Cerrar"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Size selection - prominent */}
          <div className="mt-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-2">
              Elegí tu talle
            </p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => {
                const outOfStock = s.stock === 0;
                const isSelected = selected === s.nombre;
                const lowStock = s.stock > 0 && s.stock <= 5;

                return (
                  <button
                    key={s.id}
                    type="button"
                    disabled={outOfStock}
                    onClick={() => {
                      setSelected(s.nombre);
                      setError(false);
                    }}
                    className={`relative flex flex-col items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                      outOfStock
                        ? "cursor-not-allowed bg-gray-100 text-gray-500 ring-1 ring-gray-200"
                        : isSelected
                          ? "text-white shadow-lg ring-2 scale-105"
                          : "bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-gray-300 hover:bg-gray-50 active:scale-95"
                    }`}
                    style={
                      isSelected
                        ? {
                            background: `linear-gradient(135deg, ${primaryColor} 0%, color-mix(in srgb, ${primaryColor} 75%, #0f172a) 100%)`,
                            boxShadow: `0 4px 14px -4px ${primaryColor}80`,
                            ringColor: primaryColor,
                          }
                        : undefined
                    }
                  >
                    <span className="text-lg leading-none">{s.nombre}</span>
                    <span
                      className={`mt-1.5 text-[10px] font-medium leading-none ${
                        outOfStock
                          ? "text-red-400"
                          : isSelected
                            ? "text-white/80"
                            : lowStock
                              ? "text-amber-500"
                              : "text-green-600"
                      }`}
                    >
                      {outOfStock ? "Sin stock" : `${s.stock} disp.`}
                    </span>
                    {isSelected && (
                      <div
                        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm"
                        style={{ color: primaryColor }}
                      >
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            {error && (
              <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 animate-shake">
                <svg className="h-4 w-4 flex-shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-sm font-medium text-red-600">Seleccioná un talle</p>
              </div>
            )}
          </div>

          {/* Image + Quantity + Subtotal row */}
          <div className="mt-5 rounded-2xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white/50 p-4 shadow-sm ring-1 ring-inset ring-white">
            <div className="flex items-center flex-col w-full justify-between gap-3">
              {/* Left: image + quantity */}
              <div className="flex items-center gap-3">
                {img && (
                  <div
                    className="h-12 w-12 shrink-0 overflow-hidden rounded-lg ring-1 ring-gray-100"
                    style={{ background: `${primaryColor}08` }}
                  >
                    <img
                      src={img}
                      alt={p.nombre}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center gap-1 rounded-xl bg-white/80 px-1 py-1 ring-1 ring-inset ring-gray-200 shadow-sm">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-900 active:scale-95"
                    aria-label="Disminuir cantidad"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                  <span className="w-8 text-center text-base font-bold tabular-nums text-gray-900 select-none">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-900 active:scale-95"
                    aria-label="Aumentar cantidad"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Right: subtotal */}
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                  Subtotal
                </p>
                <p className="text-xl font-bold tabular-nums" style={{ color: primaryColor }}>
                  {formatPrice(subtotal)}
                </p>
              </div>
            </div>
          </div>

          {/* Selected size summary */}
          {selected && (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 ring-1 ring-inset ring-blue-100 animate-slide-up">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-inset ring-blue-100">
                <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-700">
                  Talle seleccionado
                </p>
                <p className="text-base font-semibold text-gray-900 truncate">
                  {selected}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                  Disponible
                </p>
                <p className="text-sm font-bold text-green-600">
                  {sizes.find((s) => s.nombre === selected)?.stock ?? 0} u.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex gap-3 border-t border-gray-100 px-5 py-4 bg-white/80 backdrop-blur-sm">
          <button
            onClick={() => !added && onClose()}
            disabled={added}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-gray-600 ring-1 ring-inset ring-gray-200 transition-all hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98] disabled:opacity-40"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Cancelar
          </button>
          <button
            onClick={handleAdd}
            disabled={added || !selected}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:hover:shadow-lg disabled:active:scale-100"
            style={{
              background: `linear-gradient(135deg, ${primaryColor} 0%, color-mix(in srgb, ${primaryColor} 70%, #0f172a) 100%)`,
              boxShadow: `0 4px 14px -4px ${primaryColor}80`,
            }}
          >
            {added ? (
              <>
                <svg className="h-4 w-4 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Agregado
              </>
            ) : (
              <>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  <path d="M12 9v6" />
                  <path d="M9 12h6" />
                </svg>
                Agregar al carrito
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
