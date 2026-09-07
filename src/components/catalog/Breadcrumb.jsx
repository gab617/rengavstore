export default function Breadcrumb({ nombre, onHome }) {
  return (
    <nav className="flex items-center gap-1.5 text-[13px]" aria-label="Navegación">
      <button
        onClick={onHome}
        className="font-medium text-[var(--color-secondary)] transition-colors hover:text-[var(--color-texto)]"
      >
        Catálogo
      </button>
      <span className="text-[var(--color-borde)]" aria-hidden>
        /
      </span>
      <span className="font-semibold text-[var(--color-texto)]">{nombre}</span>
    </nav>
  );
}
