export default function Chip({ active, onClick, className = "", children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium text-[13px] transition-all ${
        active
          ? "text-[var(--color-primary-texto)] shadow-md"
          : "bg-[var(--color-tarjeta)] text-[var(--color-secondary)] ring-1 ring-[var(--color-borde)] hover:text-[var(--color-texto)] hover:ring-[var(--color-texto)]/50"
      } ${className}`}
      style={
        active
          ? {
              background: "var(--color-primary)",
              boxShadow: "0 6px 16px -8px var(--color-primary)",
            }
          : undefined
      }
    >
      {children}
    </button>
  );
}
