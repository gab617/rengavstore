export default function CartBadge({ count, onClick, primary = "#2563eb" }) {
  const label = count === 1 ? "1 producto" : `${count} productos`;

  return (
    <button
      onClick={onClick}
      aria-label={`Abrir carrito de compras (${label})`}
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl ring-4 ring-white/60 transition-all hover:opacity-90 hover:shadow-2xl active:scale-95"
      style={{ background: primary }}
    >
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>

      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold tabular-nums text-white ring-2 ring-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
