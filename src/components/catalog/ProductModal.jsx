import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useCart from "../../hooks/useCart";
import { publicUrl } from "../../lib/storefront";
import { formatPrice } from "../../lib/tienda";
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
        className="relative flex max-h-[92vh] sm:max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex shrink-0 items-center justify-between px-4 py-3 sm:px-6 sm:py-4 text-white"
          style={{
            background: `linear-gradient(135deg, ${primary} 0%, color-mix(in srgb, ${primary} 70%, #0f172a) 100%)`,
          }}
        >
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
              {p.marca || "Producto"}
            </p>
            <h3 className="truncate font-display text-lg sm:text-xl font-semibold tracking-tight">
              {p.nombre}
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
            <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-gray-100 sm:aspect-[4/3]">
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
                    className="h-16 w-16 text-gray-300"
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
                  <span className="text-sm font-medium text-gray-400">
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
                        : "opacity-50 ring-1 ring-gray-200 hover:opacity-100"
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

          <div className="space-y-3 px-4 pb-5 sm:px-6 sm:pb-6">
            <div className="flex flex-wrap items-center gap-2">
              <AvailabilityBadge disponibilidad={p.disponibilidad} />
              {p.tipo_unit && (
                <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-500 ring-1 ring-inset ring-gray-200">
                  {p.tipo_unit}
                </span>
              )}
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Precio
              </p>
              <p
                className="mt-1 text-2xl font-bold tabular-nums"
                style={{ color: primary }}
              >
                {formatPrice(p.precio_venta)}
              </p>
            </div>

            {hasSizes && (
              <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
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
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 px-4 py-3 text-center">
                <p className="text-sm font-semibold text-gray-500">
                  {p.precio_venta == null
                    ? "Consultá por este producto"
                    : "Producto agotado"}
                </p>
              </div>
            ) : inCart ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50/60 p-3.5">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      Ya está en tu carrito
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-gray-900">
                      {enCarrito} × {formatPrice(p.precio_venta)}
                      {selectedTalle && (
                        <span className="ml-1 text-gray-400">
                          · Talle {selectedTalle}
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="text-base font-bold tabular-nums text-gray-900">
                    {formatPrice(enCarrito * p.precio_venta)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <QtyStepper value={qty} onChange={setQty} />
                  <button
                    onClick={handleAdd}
                    className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.99]"
                    style={{ background: primary }}
                  >
                    {added ? "Agregado ✓" : "Agregar más"}
                  </button>
                </div>

                <button
                  onClick={() => removeItem(p.id, selectedTalle)}
                  className="w-full rounded-xl py-2.5 text-sm font-semibold text-red-600 ring-1 ring-inset ring-red-200 transition-colors hover:bg-red-50"
                >
                  Quitar del carrito
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <QtyStepper value={qty} onChange={setQty} />
                <button
                  onClick={handleAdd}
                  className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.99]"
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
                    className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                    style={{
                      background: `color-mix(in srgb, ${primary} 15%, white)`,
                      color: primary,
                    }}
                  >
                    {categoria}
                  </span>
                )}
                {sub && (
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200">
                    {sub}
                  </span>
                )}
              </div>
            )}

            {p.descripcion && (
              <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Descripción
                </p>
                <p className="mt-1 text-sm leading-relaxed text-gray-700">
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
    <div className="flex items-center rounded-xl ring-1 ring-inset ring-gray-200">
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        className="px-3 py-2 text-base text-gray-500 transition-colors hover:text-gray-900"
        aria-label="Disminuir cantidad"
      >
        −
      </button>
      <span className="w-8 text-center text-sm font-bold tabular-nums text-gray-900">
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        className="px-3 py-2 text-base text-gray-500 transition-colors hover:text-gray-900"
        aria-label="Aumentar cantidad"
      >
        +
      </button>
    </div>
  );
}
