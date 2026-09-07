export default function CatalogEmpty({ q, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl surface-soft text-2xl">
        🔍
      </div>
      <p className="mt-4 font-medium text-[var(--color-secondary)]">
        {q
          ? `Sin resultados para "${q}".`
          : "No hay productos en esta selección."}
      </p>
      {onClear && (
        <button
          onClick={onClear}
          className="mt-2 text-sm text-[var(--color-secondary)] underline underline-offset-2 transition-colors hover:text-[var(--color-texto)]"
        >
          Limpiar búsqueda
        </button>
      )}
    </div>
  );
}
