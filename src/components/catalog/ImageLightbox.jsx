import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { publicUrl } from "../../lib/storefront";

export default function ImageLightbox({ p, imagenes = [], initial = 0, onClose, onNavigate }) {
  const [idx, setIdx] = useState(initial);
  const [imgError, setImgError] = useState(false);
  const count = imagenes.length;
  const canNav = count > 1;

  useEffect(() => {
    setIdx(initial);
    setImgError(false);
  }, [initial]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (!canNav) return;
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % count);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, canNav, count]);

  const go = (i) => {
    const nextIdx = (i + count) % count;
    setIdx(nextIdx);
    setImgError(false);
    onNavigate?.(nextIdx);
  };

  const img = imagenes[idx] ? publicUrl(imagenes[idx]) : null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={p.nombre}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {canNav && (
        <span className="absolute left-1/2 top-4 z-20 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur-md">
          {idx + 1} / {count}
        </span>
      )}

      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl text-white backdrop-blur-md transition-all duration-300 hover:bg-white/25 hover:rotate-90"
        aria-label="Cerrar"
      >
        ✕
      </button>

      <div className="absolute inset-0 z-0 flex items-center justify-center px-4 sm:px-20">
        {img && !imgError ? (
          <img
            src={img}
            alt={p.nombre}
            className="max-h-full max-w-full object-contain drop-shadow-2xl animate-scale-in"
          />
        ) : (
          <span className="flex flex-col items-center gap-2 text-white/40">
            <svg
              className="h-16 w-16"
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
            <span className="text-sm font-medium">Sin imagen</span>
          </span>
        )}
      </div>

      {canNav && (
        <>
          <button
            onClick={() => go(idx - 1)}
            className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-xl text-white backdrop-blur-md transition-all hover:bg-white/25 active:scale-95 sm:left-5"
            aria-label="Imagen anterior"
          >
            ←
          </button>
          <button
            onClick={() => go(idx + 1)}
            className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-xl text-white backdrop-blur-md transition-all hover:bg-white/25 active:scale-95 sm:right-5"
            aria-label="Imagen siguiente"
          >
            →
          </button>

          <div className="absolute bottom-5 left-1/2 z-10 flex max-w-[92vw] -translate-x-1/2 items-center gap-2 overflow-x-auto no-scrollbar sm:bottom-8">
            {imagenes.map((im, i) => (
              <button
                key={`${im}-${i}`}
                onClick={() => go(i)}
                className={`h-12 w-12 shrink-0 overflow-hidden rounded-xl transition-all sm:h-14 sm:w-14 ${
                  i === idx
                    ? "border-2 border-white opacity-100 ring-2 ring-white/40"
                    : "border border-white/20 opacity-40 hover:opacity-80"
                }`}
                aria-label={`Ver imagen ${i + 1}`}
              >
                <img src={publicUrl(im)} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>,
    document.body,
  );
}