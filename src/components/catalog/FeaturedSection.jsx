import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import FeaturedCard from "./FeaturedCard";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export default function FeaturedSection({ productos, onOpen, onSeeCategory, theme }) {
  const trackRef = useRef(null);
  const contentRef = useRef(null);
  const animRef = useRef(null);
  const prevHRef = useRef(null);
  const prevExpandedRef = useRef(false);
  const [expandido, setExpandido] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const primary = theme?.primary || "#2563eb";

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    if (expandido) return;
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    el.addEventListener("scroll", updateArrows, { passive: true });
    updateArrows();
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", updateArrows);
    };
  }, [expandido, updateArrows]);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const changed = prevExpandedRef.current !== expandido;
    prevExpandedRef.current = expandido;

    animRef.current?.cancel();
    animRef.current = null;
    el.style.height = "";
    const target = el.offsetHeight;

    if (changed && prevHRef.current !== null) {
      const from = prevHRef.current;
      const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (Math.abs(target - from) > 2 && !reduceMotion) {
        el.style.height = `${from}px`;
        const anim = el.animate(
          [{ height: `${from}px` }, { height: `${target}px` }],
          { duration: 320, easing: EASE }
        );
        animRef.current = anim;
        anim.onfinish = () => {
          el.style.height = "";
          animRef.current = null;
        };
      }
    }
    prevHRef.current = target;
    return () => animRef.current?.cancel();
  }, [expandido]);

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector(":scope > div");
    const step = (card ? card.offsetWidth : 224) + 12;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const arrowBtnClass =
    "flex h-8 w-8 items-center justify-center rounded-full text-white shadow-md transition-all enabled:hover:scale-110 enabled:active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed";

  return (
    <section className="mb-5">
      <div className="mb-2.5 flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 font-display text-base sm:text-lg font-semibold tracking-tight text-gray-900">
          <span className="text-sm text-amber-500" aria-hidden>
            ★
          </span>
          Destacados
        </h2>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden text-xs text-gray-400 sm:inline">
            {productos.length} productos
          </span>
          <div
            className={`flex items-center gap-1.5 ${
              !expandido && (canPrev || canNext) ? "" : "invisible"
            }`}
          >
            <button
              onClick={() => scrollByCard(-1)}
              disabled={!canPrev}
              aria-label="Productos anteriores"
              className={arrowBtnClass}
              style={{
                background: `linear-gradient(135deg, ${primary} 0%, color-mix(in srgb, ${primary} 70%, #0f172a) 100%)`,
                boxShadow: `0 4px 14px -4px ${primary}80`,
              }}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scrollByCard(1)}
              disabled={!canNext}
              aria-label="Productos siguientes"
              className={arrowBtnClass}
              style={{
                background: `linear-gradient(135deg, ${primary} 0%, color-mix(in srgb, ${primary} 70%, #0f172a) 100%)`,
                boxShadow: `0 4px 14px -4px ${primary}80`,
              }}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <button
            onClick={() => setExpandido((v) => !v)}
            className="inline-flex items-center gap-0.5 text-xs font-bold transition-colors"
            style={{ color: primary }}
            aria-expanded={expandido}
          >
            <span>{expandido ? "Ver menos" : "Ver todos"}</span>
            <svg
              className={`h-3.5 w-3.5 transition-transform duration-300 ${expandido ? "rotate-180" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div ref={contentRef} className={expandido ? "overflow-hidden" : ""}>
        {expandido ? (
          <div className="animate-fade-in-up grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {productos.map((p) => (
              <FeaturedCard
                key={p.id}
                p={p}
                onOpen={() => onOpen(p)}
                onSeeCategory={() => onSeeCategory(p)}
                theme={theme}
              />
            ))}
          </div>
        ) : (
          <div
            ref={trackRef}
            className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:-mx-0 sm:px-0 snap-x snap-mandatory [mask-image:linear-gradient(90deg,black_85%,transparent)]"
          >
            {productos.map((p) => (
              <div key={p.id} className="w-48 shrink-0 sm:w-56 snap-start">
                <FeaturedCard
                  p={p}
                  onOpen={() => onOpen(p)}
                  onSeeCategory={() => onSeeCategory(p)}
                  theme={theme}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
