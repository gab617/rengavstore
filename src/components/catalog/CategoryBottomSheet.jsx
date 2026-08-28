import { useState, useMemo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import CategorySearch from "./CategorySearch";
import { SocialLinks } from "../layout/SocialLinks";

export default function CategoryBottomSheet({
  isOpen,
  onClose,
  onSelect,
  categorias,
  activeCategoryId,
  settings,
}) {
  const [query, setQuery] = useState("");
  const contentRef = useRef(null);
  const startY = useRef(0);
  const isDragging = useRef(false);
  const [isExiting, setIsExiting] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return categorias;
    const q = query.toLowerCase();
    return categorias.filter((c) =>
      c.nombre.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  }, [categorias, query]);

  useEffect(() => {
    if (isOpen) {
      setIsExiting(false);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    if (isOpen) {
      setIsExiting(true);
      setTimeout(() => {
        onClose();
        setIsExiting(false);
      }, 200);
    }
  };

  const currentY = useRef(0);
  const dragEnabled = useRef(false);
  const startTime = useRef(0);

  const handleTouchStart = (e) => {
    const target = e.target;
    const handle = target.closest("[data-handle]");
    const searchInput = target.closest("input[type='search']");

    // SOLO drag-to-close desde el handle explícitamente
    if (!handle) return;
    if (searchInput) return;
    if (e.touches.length !== 1) return;

    dragEnabled.current = true;
    startY.current = e.touches[0].clientY;
    startTime.current = Date.now();
    isDragging.current = true;
    currentY.current = 0;
    if (contentRef.current) contentRef.current.style.transition = "none";
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current || !dragEnabled.current) return;
    const y = e.touches[0].clientY;
    const delta = y - startY.current;
    // Solo mover si arrastramos HACIA ABAJO (delta > 0)
    if (delta > 0 && contentRef.current) {
      currentY.current = delta;
      contentRef.current.style.transform = `translateY(${delta}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current || !dragEnabled.current || !contentRef.current) return;
    
    const duration = Date.now() - startTime.current;
    const velocity = currentY.current / duration; // px/ms
    
    isDragging.current = false;
    dragEnabled.current = false;
    contentRef.current.style.transition = "transform 250ms cubic-bezier(0.34,1.56,0.64,1)";
    
    // Cerrar solo si: arrastró > 120px O velocidad > 0.5px/ms (flick rápido)
    if (currentY.current > 120 || velocity > 0.5) {
      handleClose();
    } else {
      contentRef.current.style.transform = "translateY(0)";
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  if (!isOpen && !isExiting) return null;

  const overlayStyle = {
    opacity: isExiting ? 0 : 1,
    transition: "opacity 200ms ease",
  };

  const sheetStyle = {
    transform: isExiting ? "translateY(100%)" : "translateY(0)",
    transition: isExiting
      ? "transform 200ms cubic-bezier(0.4, 0, 1, 1)"
      : "transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1)",
  };

  return createPortal(
    <div
      style={overlayStyle}
      className="fixed inset-0 z-[100] flex flex-col"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Categorías"
    >
      <div
        style={overlayStyle}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div
        ref={contentRef}
        style={sheetStyle}
        className="relative flex-1 flex flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <div data-handle className="flex shrink-0 items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-1 w-12 rounded-full bg-gray-300" />
            <h2 className="text-base font-semibold text-gray-900">Categorías</h2>
            {query && (
              <span className="text-[11px] font-medium text-gray-500 px-2 py-0.5 rounded-full bg-gray-100">
                {filtered.length} resultados
              </span>
            )}
          </div>
          <button
            onClick={handleClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 active:scale-95"
            aria-label="Cerrar"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <CategorySearch
            query={query}
            onChange={setQuery}
            categorias={filtered}
            onSelect={(cat) => {
              onSelect(cat);
              handleClose();
            }}
            activeCategoryId={activeCategoryId}
          />
        </div>

        {settings && (
          <div className="shrink-0 sticky bottom-0 z-10" aria-hidden="false">
            <div className="relative bg-white/95 backdrop-blur-sm shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.08)]">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-300/60 to-transparent" />
              <div className="p-4 pb-safe">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3 flex items-center gap-2">
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300/40 to-transparent" />
                  Síguenos
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300/40 to-transparent" />
                </p>
                <SocialLinks settings={settings} variant="mobile" className="justify-center gap-3" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}