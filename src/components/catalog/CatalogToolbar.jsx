export default function CatalogToolbar({ q, setQ, filtrados, total }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 min-w-0">
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-secondary)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre o marca…"
          className="w-full rounded-[var(--radio)] border border-[var(--color-borde)] bg-[var(--color-tarjeta)] py-2 pl-10 pr-4 text-sm text-[var(--color-texto)] placeholder:text-[var(--color-secondary)] transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>
      <span className="hidden sm:inline-flex items-center rounded-full border border-[var(--color-borde)] bg-[var(--color-tarjeta)] px-3 py-1.5 text-xs font-medium whitespace-nowrap text-[var(--color-secondary)]">
        {filtrados} de {total}
      </span>
    </div>
  );
}
