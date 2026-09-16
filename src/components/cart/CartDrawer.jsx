import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useCart from "../../hooks/useCart";
import { formatPrice, normalizeProductName } from "../../lib/tienda";
import { clearLastOrder, loadLastOrders, saveLastOrder, shortOrderId, whatsAppLink } from "../../lib/pedidos";
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
  const [lastOrders, setLastOrders] = useState(() => loadLastOrders(slug));
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
              saveLastOrder(slug, {
                id: res.pedido.id,
                total: res.subtotal,
                metodoPago: res.metodoPago,
                items: res.items,
              });
              setLastOrders(loadLastOrders(slug));
              clear();
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
                {lastOrders.length > 0 && (
                  <div className="w-full space-y-2">
                    <p className="text-center text-[11px] font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
                      Últimos pedidos
                    </p>
                    {lastOrders.map((order) => (
                      <LastOrderNote
                        key={order.id}
                        order={order}
                        telefono={settings?.telefono_whatsapp}
                        onClear={() => {
                          clearLastOrder(slug, order.id);
                          setLastOrders(loadLastOrders(slug));
                        }}
                      />
                    ))}
                  </div>
                )}
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

function LastOrderNote({ order, onClear, telefono }) {
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [open, setOpen] = useState(false);
  const orden = shortOrderId(order.id);
  const items = order.items || [];
  const fecha = order.fecha
    ? new Date(order.fecha).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;
  const linkWsp = whatsAppLink(
    telefono,
    `¡Hola! Quería consultar sobre mi pedido ${orden}.`,
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(orden);
    } catch {
      const el = document.createElement("textarea");
      el.value = orden;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full overflow-hidden rounded-[var(--radio)] border border-[var(--color-borde)] surface-soft text-left">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 p-3 transition-colors hover:surface-soft"
        aria-expanded={open}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
          ✓
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
            Pedido {orden}
            {fecha && (
              <span className="ml-1 normal-case tracking-normal">· {fecha}</span>
            )}
          </p>
          <p className="truncate text-sm font-bold text-[var(--color-texto)]">
            {orden}
            {order.total != null && (
              <span className="ml-1 font-medium text-[var(--color-secondary)]">
                · {formatPrice(order.total)}
              </span>
            )}
          </p>
        </div>
        <svg
          className={`h-4 w-4 shrink-0 text-[var(--color-secondary)] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="space-y-3 border-t border-[var(--color-borde)] px-3 py-3">
          {items.length > 0 ? (
            <ul className="space-y-1.5">
              {items.map((i, idx) => (
                <li
                  key={`${i.nombre}${i.talle || ""}${idx}`}
                  className="flex items-baseline justify-between gap-3 text-xs"
                >
                  <span className="min-w-0 text-[var(--color-texto)]">
                    <span className="font-medium">{normalizeProductName(i.nombre)}</span>
                    {i.talle && (
                      <span className="ml-1 text-[var(--color-secondary)]">
                        · Talle {i.talle}
                      </span>
                    )}
                    <span className="text-[var(--color-secondary)]">
                      {" "}x{i.cantidad}
                    </span>
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums text-[var(--color-texto)]">
                    {formatPrice(i.precio_unitario * i.cantidad)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[var(--color-secondary)]">
              No hay detalle de productos guardado.
            </p>
          )}

          {order.total != null && (
            <div className="flex items-baseline justify-between border-t border-[var(--color-borde)] pt-2 text-sm">
              <span className="font-medium text-[var(--color-texto)]">Total</span>
              <span className="font-bold tabular-nums text-[var(--color-texto)]">
                {formatPrice(order.total)}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            {linkWsp && (
              <a
                href={linkWsp}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#25D366] px-2.5 py-1.5 text-[11px] font-bold text-white transition-all hover:bg-[#1fb857] active:scale-95"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Consultar
              </a>
            )}
            <button
              type="button"
              onClick={copy}
              className={`flex-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-all active:scale-95 ${
                copied
                  ? "bg-green-100 text-green-700"
                  : "text-[var(--color-primary-texto)] hover:opacity-90"
              }`}
              style={copied ? undefined : { background: "var(--color-primary)" }}
            >
              {copied ? "✓ Copiado" : "⧉ Copiar"}
            </button>
            {confirming ? (
              <span className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={onClear}
                  className="rounded-lg bg-red-500 px-2.5 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-red-600 active:scale-95"
                >
                  Eliminar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="rounded-lg px-2 py-1.5 text-[11px] font-semibold text-[var(--color-secondary)] transition-colors hover:surface-soft"
                >
                  Cancelar
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-[var(--color-secondary)] transition-colors hover:bg-red-50 hover:text-red-500"
              >
                ✕ Eliminar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
