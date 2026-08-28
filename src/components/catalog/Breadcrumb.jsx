export default function Breadcrumb({ nombre, onHome }) {
  return (
    <nav className="flex items-center gap-1.5 text-[13px]" aria-label="Navegación">
      <button
        onClick={onHome}
        className="font-medium text-gray-500 transition-colors hover:text-gray-900"
      >
        Catálogo
      </button>
      <span className="text-gray-300" aria-hidden>
        /
      </span>
      <span className="font-semibold text-gray-900">{nombre}</span>
    </nav>
  );
}
