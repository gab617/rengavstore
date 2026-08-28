import useCart from "../../hooks/useCart";
import { publicUrl } from "../../lib/storefront";
import { formatPrice } from "../../lib/tienda";

export default function CartLineItem({ item }) {
  const { setQuantity, removeItem } = useCart();
  const img = item.image ? publicUrl(item.image) : null;

  return (
    <li className="flex gap-3.5 px-4 py-4">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 ring-1 ring-gray-900/5">
        {img ? (
          <img src={img} alt={item.nombre} className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-lg text-gray-300">
            🛍️
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {item.marca && (
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                {item.marca}
              </p>
            )}
            <p className="truncate text-sm font-medium leading-snug text-gray-900">
              {item.nombre}
              {item.talle && (
                <span className="ml-1 text-xs font-normal text-gray-400">
                  · Talle {item.talle}
                </span>
              )}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <p className="text-sm font-bold tabular-nums text-gray-900">
              {formatPrice(item.unitPrice * item.quantity)}
            </p>
            <button
              onClick={() => removeItem(item.id, item.talle)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors hover:bg-red-100 hover:text-red-600"
              aria-label={`Quitar ${item.nombre} del carrito`}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center rounded-xl ring-1 ring-inset ring-gray-200">
            <button
              onClick={() => setQuantity(item.id, item.quantity - 1, item.talle)}
              disabled={item.quantity <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-l-xl text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:hover:bg-transparent"
              aria-label="Disminuir cantidad"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-semibold tabular-nums text-gray-900">
              {item.quantity}
            </span>
            <button
              onClick={() => setQuantity(item.id, item.quantity + 1, item.talle)}
              className="flex h-8 w-8 items-center justify-center rounded-r-xl text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>

          <p className="text-[10px] tabular-nums text-gray-400">
            {formatPrice(item.unitPrice)} c/u
          </p>
        </div>
      </div>
    </li>
  );
}
