import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useCart from "../../hooks/useCart";
import { formatPrice } from "../../lib/tienda";
import CartLineItem from "./CartLineItem";
import CheckoutForm from "./CheckoutForm";
import PedidoConfirmado from "./PedidoConfirmado";

const TRANSITION_MS = 350;

export default function CartDrawer({
  open,
  onClose,
  theme,
  slug,
  sucursalNombre,
  settings,
}) {
  const { items, count, subtotal, clear } = useCart();
  const [view, setView] = useState("carrito");
  const [resultado, setResultado] = useState(null);
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [rendered, setRendered] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf;
    let timer;
    if (open) {
      setRendered(true);
      raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      timer = setTimeout(() => setRendered(false), TRANSITION_MS);
    }
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [open]);

  useEffect(() => {
    if (!rendered) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [rendered, onClose]);

  useEffect(() => {
    if (!open) {
      setView("carrito");
      setResultado(null);
      setConfirmingClear(false);
    }
  }, [open]);

  if (!rendered) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[110]"
      role="dialog"
      aria-modal="true"
      aria-label="Carrito de compras"
    >
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`absolute inset-x-0 bottom-0 flex max-h-[88dvh] w-full flex-col overflow-hidden rounded-t-[var(--radio)] bg-[var(--color-tarjeta)] shadow-2xl will-change-transform transition-transform duration-300 ease-out md:inset-y-0 md:right-0 md:max-h-none md:max-w-sm md:rounded-none ${
          visible
            ? "translate-y-0 md:translate-x-0"
            : "translate-y-full md:translate-y-0 md:translate-x-full"
        }`}
        style={theme?.vars}
      >
        {view === "checkout" ? (
          <CheckoutForm
            slug={slug}
            sucursalNombre={sucursalNombre}
            onBack={() => setView("carrito")}
            onClose={onClose}
            onSuccess={(res) => {
              setResultado(res);
              setView("exito");
            }}
          />
        ) : view === "exito" && resultado ? (
          <PedidoConfirmado
            resultado={resultado}
            settings={settings}
            sucursalNombre={sucursalNombre}
            onClose={onClose}
          />
        ) : (
          <>
            <header className="shrink-0 border-b border-[var(--color-borde)]">
              <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-[var(--color-borde)] md:hidden" />
              <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-3 md:pt-4">
                <h2 className="font-display text-base font-semibold tracking-tight text-[var(--color-texto)]">
                  Tu carrito
                  {count > 0 && (
                    <span className="ml-2 text-xs font-medium text-[var(--color-secondary)]">
                      ({count} {count === 1 ? "producto" : "productos"})
                    </span>
                  )}
                </h2>
                <div className="flex items-center gap-0.5">
                  {items.length > 0 && (
                    <button
                      onClick={() => setConfirmingClear(true)}
                      className="flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-[var(--color-secondary)] transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <svg
                        className="h-3.5 w-3.5"
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
                      Vaciar
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-secondary)] transition-colors hover:bg-gray-100 hover:text-[var(--color-texto)]"
                    aria-label="Cerrar carrito"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </header>

            {confirmingClear && (
              <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-red-100 bg-red-50 px-4 py-2.5">
                <p className="text-sm font-medium text-red-700">
                  ¿Vaciar todo el carrito?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setConfirmingClear(false)}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-[var(--color-secondary)] transition-colors hover:surface-soft"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      clear();
                      setConfirmingClear(false);
                    }}
                    className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-red-600"
                  >
                    Sí, vaciar
                  </button>
                </div>
              </div>
            )}

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full surface-soft text-4xl ring-1 ring-[var(--color-borde)]">
                  🛒
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-texto)]">
                    Tu carrito está vacío
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-secondary)]">
                    Explorá el catálogo y agregá productos.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="mt-1 rounded-[var(--radio)] px-5 py-2.5 text-xs font-semibold text-[var(--color-primary-texto)] shadow-md transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ background: "var(--color-primary)" }}
                >
                  Seguir comprando
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-[var(--color-borde)] overflow-y-auto">
                  {items.map((item) => (
                    <CartLineItem key={item.id} item={item} />
                  ))}
                </ul>

                <footer className="shrink-0 border-t border-[var(--color-borde)] surface-soft p-4 pb-6">
                  <div className="flex items-end justify-between">
                    <span className="pb-0.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
                      Subtotal
                    </span>
                    <span className="text-xl font-bold tabular-nums text-[var(--color-texto)]">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <button
                    onClick={() => setView("checkout")}
                    className="mt-3 w-full rounded-[var(--radio)] py-3.5 text-sm font-bold text-[var(--color-primary-texto)] shadow-lg transition-all hover:opacity-95 hover:shadow-xl active:scale-[0.99]"
                    style={{
                      background: `linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-primary) 72%, #0f172a) 100%)`,
                    }}
                  >
                    Finalizar pedido
                  </button>
                </footer>
              </>
            )}
          </>
        )}
      </aside>
    </div>,
    document.body,
  );
}
