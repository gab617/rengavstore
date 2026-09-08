import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useCart from "../../hooks/useCart";
import { publicUrl } from "../../lib/storefront";
import { formatPrice, normalizeProductName } from "../../lib/tienda";
import AvailabilityBadge from "./AvailabilityBadge";
import SizeChips from "./SizeChips";

export default function ProductModal({ p, onClose, theme }) {
  const imagenes = (p.imagenes || []).filter(Boolean);
  const [sel, setSel] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedTalle, setSelectedTalle] = useState(null);
  const [talleError, setTalleError] = useState(false);
  const { addItem, removeItem, canAdd, has, getQuantity } = useCart();

  const sizes = p.talles || [];
  const hasSizes = sizes.length > 0;
  const inCart = has(p.id, selectedTalle);
  const enCarrito = getQuantity(p.id, selectedTalle);

  useEffect(() => {
    setSel(0);
    setImgError(false);
    setQty(1);
    setAdded(false);
    setSelectedTalle(null);
    setTalleError(false);
  }, [p.id]);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(t);
  }, [added]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (imagenes.length > 1) {
        if (e.key === "ArrowRight") setSel((i) => (i + 1) % imagenes.length);
        if (e.key === "ArrowLeft")
          setSel((i) => (i - 1 + imagenes.length) % imagenes.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, imagenes.length]);

  const primary = theme?.primary || "#2563eb";
  const img = imagenes[sel] ? publicUrl(imagenes[sel]) : null;
  const categoria = p.categoria?.nombre;
  const sub = p.subcategoria?.nombre;

  const prev = () =>
    setSel((i) => (i - 1 + imagenes.length) % imagenes.length);
  const next = () => setSel((i) => (i + 1) % imagenes.length);

  const handleAdd = () => {
    if (hasSizes && !selectedTalle) {
      setTalleError(true);
      return;
    }
    setTalleError(false);
    addItem(p, qty, selectedTalle);
    setAdded(true);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-6 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[var(--radio)] bg-[var(--color-tarjeta)] shadow-2xl animate-scale-in"
        style={theme?.vars}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex shrink-0 items-center justify-between px-4 py-2.5 sm:px-6 sm:py-3"
          style={{
            background: `linear-gradient(135deg, ${primary} 0%, color-mix(in srgb, ${primary} 70%, #0f172a) 100%)`,
            color: "var(--color-primary-texto)",
          }}
        >
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60">
              {p.marca || "Producto"}
            </p>
            <h3 className="truncate font-display text-lg sm:text-xl font-semibold tracking-tight">
              {normalizeProductName(p.nombre)}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg transition-colors hover:bg-white/25"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto">
          <div className="p-4 pb-2 sm:p-6 sm:pb-3">
            <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[var(--radio)] border border-[var(--color-borde)] surface-soft sm:aspect-[4/3]">
              {img && !imgError ? (
                <img
                  src={img}
                  alt={p.nombre}
                  className="h-full w-full object-contain"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="flex flex-col items-center gap-2">
                  <svg
                    className="h-16 w-16 text-[var(--color-borde)]"
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
                  <span className="text-sm font-medium text-[var(--color-secondary)]">
                    Sin imagen
                  </span>
                </span>
              )}

              {imagenes.length > 1 && !imgError && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-md backdrop-blur transition-colors hover:bg-white"
                    aria-label="Anterior"
                  >
                    ←
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-md backdrop-blur transition-colors hover:bg-white"
                    aria-label="Siguiente"
                  >
                    →
                  </button>
                  <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
                    {sel + 1}/{imagenes.length}
                  </span>
                </>
              )}
            </div>

            {imagenes.length > 1 && !imgError && (
              <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
                {imagenes.map((im, idx) => (
                  <button
                    key={`${im}-${idx}`}
                    onClick={() => {
                      setSel(idx);
                      setImgError(false);
                    }}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl transition-all ${
                      idx === sel
                        ? "ring-2 ring-[var(--color-primary)] opacity-100"
                        : "opacity-50 ring-1 ring-[var(--color-borde)] hover:opacity-100"
                    }`}
                  >
                    <img
                      src={publicUrl(im)}
                      alt={`Imagen ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2 px-4 pb-4 sm:space-y-2.5 sm:px-6 sm:pb-5">
            <div className="flex flex-wrap items-center gap-2">
              <AvailabilityBadge disponibilidad={p.disponibilidad} />
              {p.tipo_unit && (
<span className="inline-flex items-center rounded-full bg-[var(--color-tarjeta)] px-2.5 py-1 text-xs font-medium text-[var(--color-secondary)] ring-1 ring-inset ring-[var(--color-borde)]">
                   {p.tipo_unit}
                 </span>
              )}
            </div>

            <div className="rounded-[var(--radio)] border border-[var(--color-borde)] surface-soft p-3 sm:p-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
                Precio
              </p>
              <p className="mt-0.5 text-xl font-bold tabular-nums sm:mt-1 sm:text-2xl"
                style={{ color: "var(--color-accent)" }}
              >
                {formatPrice(p.precio_venta)}
              </p>
            </div>

            {hasSizes && (
              <div className="rounded-[var(--radio)] border border-[var(--color-borde)] surface-soft p-3 sm:p-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
                  Elegí tu talle
                </p>
                <div className="mt-2">
                  <SizeChips
                    sizes={sizes}
                    selected={selectedTalle}
                    onSelect={(nombre) => {
                      setSelectedTalle(nombre);
                      setTalleError(false);
                    }}
                  />
                </div>
                {talleError && (
                  <p className="mt-2 text-xs font-medium text-red-500">
                    Seleccioná un talle antes de agregar al carrito
                  </p>
                )}
              </div>
            )}

            {!canAdd(p) ? (
              <div className="rounded-[var(--radio)] border border-dashed border-[var(--color-borde)] surface-soft px-3 py-2.5 text-center sm:px-4 sm:py-3">
                <p className="text-sm font-semibold text-[var(--color-secondary)]">
                  {p.precio_venta == null
                    ? "Consultá por este producto"
                    : "Producto agotado"}
                </p>
              </div>
            ) : inCart ? (
              <div className="space-y-2 sm:space-y-2.5">
                <div className="flex items-center justify-between gap-3 rounded-[var(--radio)] border border-[var(--color-borde)] surface-soft p-3 sm:p-3.5">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
                      Ya está en tu carrito
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-[var(--color-texto)]">
                      {enCarrito} × {formatPrice(p.precio_venta)}
                      {selectedTalle && (
                        <span className="ml-1 text-[var(--color-secondary)]">
                          · Talle {selectedTalle}
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="text-base font-bold tabular-nums text-[var(--color-texto)]">
                    {formatPrice(enCarrito * p.precio_venta)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <QtyStepper value={qty} onChange={setQty} />
                  <button
                    onClick={handleAdd}
                    className="flex-1 rounded-[var(--radio)] py-2.5 text-sm font-semibold text-[var(--color-primary-texto)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] active:translate-y-0 active:scale-[0.98]"
                    style={{
                      background: `linear-gradient(135deg, ${primary} 0%, color-mix(in srgb, ${primary} 72%, #0f172a) 100%)`,
                      boxShadow: `0 4px 14px -4px ${primary}80`,
                    }}
                  >
                    {added ? "Agregado ✓" : "Agregar más"}
                  </button>
                </div>

                <button
                  onClick={() => removeItem(p.id, selectedTalle)}
                  className="w-full rounded-xl py-2 sm:py-2.5 text-sm font-semibold text-red-600 ring-1 ring-inset ring-red-200 transition-all duration-200 hover:bg-red-50 hover:ring-red-300 active:scale-[0.98]"
                >
                  Quitar del carrito
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <QtyStepper value={qty} onChange={setQty} />
                <button
                  onClick={handleAdd}
                  className="flex-1 rounded-[var(--radio)] py-2.5 text-sm font-semibold text-[var(--color-primary-texto)] transition-all hover:opacity-90 active:scale-[0.99]"
                  style={{ background: primary }}
                >
                  {added ? "Agregado ✓" : "Agregar al carrito"}
                </button>
              </div>
            )}

            {(categoria || sub) && (
              <div className="flex flex-wrap gap-2">
                {categoria && (
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      background: `color-mix(in srgb, var(--color-primary) 15%, var(--color-tarjeta))`,
                      color: "var(--color-primary)",
                    }}
                  >
                    {categoria}
                  </span>
                )}
                {sub && (
                  <span className="rounded-full bg-[var(--color-tarjeta)] px-3 py-1 text-xs font-medium text-[var(--color-secondary)] ring-1 ring-inset ring-[var(--color-borde)]">
                    {sub}
                  </span>
                )}
              </div>
            )}

            {p.descripcion && (
              <div className="rounded-[var(--radio)] border border-[var(--color-borde)] surface-soft p-3 sm:p-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
                  Descripción
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--color-texto)]">
                  {p.descripcion}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function QtyStepper({ value, onChange }) {
  return (
    <div className="flex items-center rounded-[var(--radio)] ring-1 ring-inset ring-[var(--color-borde)] transition-shadow hover:shadow-sm">
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        className="px-3 py-2 text-base text-[var(--color-secondary)] transition-all hover:bg-[var(--color-borde)]/60 hover:text-[var(--color-texto)] active:scale-95"
        aria-label="Disminuir cantidad"
      >
        −
      </button>
      <span className="w-8 text-center text-sm font-bold tabular-nums text-[var(--color-texto)]">
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        className="px-3 py-2 text-base text-[var(--color-secondary)] transition-all hover:bg-[var(--color-borde)]/60 hover:text-[var(--color-texto)] active:scale-95"
        aria-label="Aumentar cantidad"
      >
        +
      </button>
    </div>
  );
}
