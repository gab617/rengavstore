export default function CatalogEmpty({ q, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
        🔍
      </div>
      <p className="mt-4 font-medium text-gray-600">
        {q
          ? `Sin resultados para "${q}".`
          : "No hay productos en esta selección."}
      </p>
      {onClear && (
        <button
          onClick={onClear}
          className="mt-2 text-sm text-gray-400 underline underline-offset-2 transition-colors hover:text-gray-900"
        >
          Limpiar búsqueda
        </button>
      )}
    </div>
  );
}
