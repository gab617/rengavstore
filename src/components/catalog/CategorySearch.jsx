import { useEffect, useRef } from "react";
import { publicUrl } from "../../lib/storefront";

export default function CategorySearch({
  query,
  onChange,
  categorias,
  onSelect,
  activeCategoryId,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  if (!categorias?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <svg className="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <p className="mt-3 text-sm font-medium text-gray-500">
          {query ? "Sin coincidencias" : "No hay categorías"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="relative px-4 py-3 sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <label className="relative flex-1" htmlFor="cat-search">
          <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            id="cat-search"
            type="search"
            value={query}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Buscar categoría..."
            className="w-full h-10 pl-10 pr-12 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
            autoComplete="off"
          />
          {query && (
            <button
              onClick={() => onChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </label>
      </div>

      <ul className="flex-1 overflow-y-auto divide-y divide-gray-100" role="listbox" aria-label="Categorías">
        {categorias.map((cat) => {
          const isActive = activeCategoryId === cat.id;
          return (
            <li key={cat.id}>
              <button
                onClick={() => onSelect(cat)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-inset ${
                  isActive
                    ? "bg-[var(--color-primary)]/5 text-[var(--color-primary)]"
                    : "hover:bg-gray-50"
                }`}
                role="option"
                aria-selected={isActive}
              >
                {cat.imagen && (
                  <img
                    src={publicUrl(cat.imagen)}
                    alt=""
                    className={`h-10 w-10 shrink-0 rounded-lg object-cover ring-1 ring-gray-100 transition-transform ${
                      isActive ? "ring-[var(--color-primary)]/50" : ""
                    }`}
                    loading="lazy"
                  />
                )}
                <div className="min-w-0 flex-1 text-left">
                  <p className={`font-medium truncate ${isActive ? "text-[var(--color-primary)]" : "text-gray-900"}`}>
                    {cat.nombre}
                  </p>
                  {cat.count != null && (
                    <p className={`text-[11px] ${isActive ? "text-[var(--color-primary)]/70" : "text-gray-400"}`}>
                      {cat.count} {cat.count === 1 ? "producto" : "productos"}
                    </p>
                  )}
                </div>
                {isActive && (
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}