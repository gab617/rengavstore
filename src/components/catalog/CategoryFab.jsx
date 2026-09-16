export default function CategoryFab({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Filtrar categorías"
      className="fixed bottom-6 left-1/2 z-40 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full ring-4 ring-white/60 shadow-lg transition-all hover:shadow-xl active:scale-95 md:hidden surface-soft text-[var(--color-secondary)]"
      style={{
        border: "1px solid var(--color-borde)",
        color: "var(--color-texto)",
      }}
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    </button>
  );
}