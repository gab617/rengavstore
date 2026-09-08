import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useCart from "../../hooks/useCart";
import { publicUrl } from "../../lib/storefront";
import { formatPrice, normalizeProductName } from "../../lib/tienda";

export default function SizePickerModal({ p, onClose, theme }) {
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
        style={{ ...theme?.vars, ...modalStyle }}
        className="relative w-full max-w-sm overflow-hidden rounded-[var(--radio)] bg-[var(--color-tarjeta)] shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent bar */}
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(90deg, color-mix(in srgb, var(--color-accent) 15%, transparent), color-mix(in srgb, var(--color-accent) 40%, transparent), color-mix(in srgb, var(--color-accent) 15%, transparent))`,
          }}
        />

        <div className="px-5 pt-5 pb-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-secondary)]">
                Seleccionar talle
              </p>
              <p className="mt-1 text-base font-semibold text-[var(--color-texto)] leading-snug">
                {normalizeProductName(p.nombre)}
              </p>
              {p.marca && (
                <p className="mt-0.5 text-sm font-medium text-[var(--color-secondary)]">
                  {p.marca}
                </p>
              )}
            </div>
            <button
              onClick={() => !added && onClose()}
              disabled={added}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[var(--color-secondary)] transition-all hover:bg-gray-100 hover:text-[var(--color-texto)] active:scale-95 disabled:opacity-40 disabled:hover:bg-transparent"
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
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-secondary)] mb-2">
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
                    className={`group relative flex flex-col items-center justify-center rounded-[var(--radio)] px-4 py-3 text-sm font-semibold transition-all ${
                      outOfStock
                        ? "cursor-not-allowed surface-soft text-[var(--color-secondary)] ring-1 ring-[var(--color-borde)]"
                        : isSelected
                          ? "text-[var(--color-primary-texto)] shadow-lg ring-2 scale-105"
                          : "bg-[var(--color-tarjeta)] text-[var(--color-texto)] ring-1 ring-[var(--color-borde)] hover:ring-[var(--color-texto)]/40 hover:surface-soft active:scale-95"
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
                      className={`relative mt-1.5 flex h-4 w-full items-center justify-center text-[10px] font-medium leading-none ${
                        outOfStock
                          ? "text-red-400"
                          : isSelected
                            ? "text-[var(--color-primary-texto)]/80"
                            : lowStock
                              ? "text-amber-500"
                              : "text-green-600"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${
                          outOfStock
                            ? "bg-red-400 opacity-60 hidden sm:block"
                            : lowStock
                              ? "bg-amber-400 hidden sm:block sm:group-hover:scale-0 sm:group-hover:opacity-0"
                              : "bg-green-500 block sm:group-hover:scale-0 sm:group-hover:opacity-0"
                        }`}
                      />
                      <span
                        className={`absolute inset-0 flex items-center justify-center text-[10px] font-semibold transition-all duration-200 ${
                          outOfStock
                            ? "opacity-100"
                            : lowStock
                              ? `${isSelected ? "!text-[var(--color-primary-texto)]" : "text-amber-500"} opacity-100 scale-100 sm:opacity-0 sm:scale-75 sm:group-hover:scale-100 sm:group-hover:opacity-100`
                              : `${isSelected ? "!text-[var(--color-primary-texto)]" : "text-green-600"} opacity-0 scale-75 group-hover:scale-100 group-hover:opacity-100`
                        }`}
                      >
                        {outOfStock ? "Sin stock" : lowStock ? "¡Quedan pocas!" : "Disponible"}
                      </span>
                    </span>
                    {isSelected && (
                      <div
                        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-tarjeta)] shadow-sm"
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
          <div className="mt-5 rounded-[var(--radio)] border border-[var(--color-borde)] surface-soft p-4 shadow-sm">
            <div className="flex items-center flex-col w-full justify-between gap-3">
              {/* Left: image + quantity */}
              <div className="flex items-center gap-3">
                {img && (
                  <div
                    className="h-12 w-12 shrink-0 overflow-hidden rounded-lg ring-1 ring-[var(--color-borde)]"
                    style={{ background: `${primaryColor}08` }}
                  >
                    <img
                      src={img}
                      alt={p.nombre}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center gap-1 rounded-[var(--radio)] bg-[var(--color-tarjeta)]/70 px-1 py-1 ring-1 ring-inset ring-[var(--color-borde)] shadow-sm">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-secondary)] transition-all hover:bg-gray-100 hover:text-[var(--color-texto)] active:scale-95"
                    aria-label="Disminuir cantidad"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                  <span className="w-8 text-center text-base font-bold tabular-nums text-[var(--color-texto)] select-none">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-secondary)] transition-all hover:bg-gray-100 hover:text-[var(--color-texto)] active:scale-95"
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
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-secondary)]">
                  Subtotal
                </p>
                <p className="text-xl font-bold tabular-nums" style={{ color: "var(--color-accent)" }}>
                  {formatPrice(subtotal)}
                </p>
              </div>
            </div>
          </div>

          {/* Selected size summary */}
          {selected && (
            <div
              className="mt-4 flex items-center gap-3 rounded-[var(--radio)] px-4 py-3 ring-1 ring-inset animate-slide-up"
              style={{
                background: "color-mix(in srgb, var(--color-primary) 10%, var(--color-tarjeta))",
                boxShadow: `0 0 0 1px color-mix(in srgb, var(--color-primary) 25%, transparent)`,
              }}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-tarjeta)] shadow-sm"
                style={{ boxShadow: `0 0 0 1px color-mix(in srgb, var(--color-primary) 30%, transparent)` }}
              >
                <svg className="h-5 w-5" style={{ color: "var(--color-primary)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--color-primary)" }}>
                  Talle seleccionado
                </p>
                <p className="text-base font-semibold text-[var(--color-texto)] truncate">
                  {selected}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-secondary)]">
                  Stock
                </p>
                {(() => {
                  const st = sizes.find((s) => s.nombre === selected)?.stock ?? 0;
                  const cls = st === 0 ? "text-red-500" : st <= 5 ? "text-amber-500" : "text-green-600";
                  const label = st === 0 ? "Sin stock" : st <= 5 ? "¡Quedan pocas!" : "En stock";
                  return <p className={`text-sm font-bold ${cls}`}>{label}</p>;
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex gap-3 border-t border-[var(--color-borde)] px-5 py-4 bg-[var(--color-tarjeta)]/80 backdrop-blur-sm">
          <button
            onClick={() => !added && onClose()}
            disabled={added}
            className="flex-1 flex items-center justify-center gap-2 rounded-[var(--radio)] py-2.5 text-sm font-semibold text-[var(--color-secondary)] ring-1 ring-inset ring-[var(--color-borde)] transition-all hover:surface-soft hover:text-[var(--color-texto)] active:scale-[0.98] disabled:opacity-40"
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
            className="flex-1 flex items-center justify-center gap-2 rounded-[var(--radio)] py-2.5 text-sm font-semibold text-[var(--color-primary-texto)] shadow-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:hover:shadow-lg disabled:active:scale-100"
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
