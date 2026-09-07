import { useState } from "react";
import {
  buildWhatsAppMessage,
  displayPhone,
  METODO_PAGO_LABEL,
  shortOrderId,
  whatsAppLink,
} from "../../lib/pedidos";
import { formatPrice } from "../../lib/tienda";

function CopyField({ label, value, copyText = "Copiar", mono = false }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const el = document.createElement("textarea");
      el.value = value;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-[var(--radio)] border border-[var(--color-borde)] surface-soft p-3">
      <div className="flex items-center justify-between gap-3">
        <p
          className={`select-all break-all text-base font-bold text-[var(--color-texto)] ${
            mono ? "font-mono" : ""
          }`}
        >
          {value}
        </p>
        <button
          type="button"
          onClick={copy}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold shadow-sm transition-all active:scale-95 ${
            copied
              ? "bg-green-100 text-green-700 shadow-none"
              : "text-[var(--color-primary-texto)] hover:opacity-90"
          }`}
          style={copied ? undefined : { background: "var(--color-primary)" }}
        >
          {copied ? "✓ Copiado" : `⧉ ${copyText}`}
        </button>
      </div>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
        {label}
      </p>
    </div>
  );
}

export default function PedidoConfirmado({ resultado, settings, sucursalNombre, onClose }) {
  const { pedido, cliente, items, subtotal, metodoPago } = resultado;
  const telefono = settings?.telefono_whatsapp;
  const message = buildWhatsAppMessage({
    sucursalNombre,
    pedido,
    items,
    subtotal,
    cliente,
    metodoPago,
  });
  const link = whatsAppLink(telefono, message);
  const metodoLabel = METODO_PAGO_LABEL[metodoPago] ?? METODO_PAGO_LABEL.tienda;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="flex shrink-0 items-center justify-between border-b border-[var(--color-borde)] px-4 py-3.5">
        <h2 className="font-display text-lg font-semibold tracking-tight text-[var(--color-texto)]">
          Pedido registrado
        </h2>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-secondary)] transition-colors hover:bg-gray-100 hover:text-[var(--color-texto)]"
          aria-label="Cerrar carrito"
        >
          ✕
        </button>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-600">
          ✓
        </span>

        <div>
          <p className="font-display text-lg font-semibold text-[var(--color-texto)]">
            ¡Gracias {cliente.nombre.split(" ")[0]}!
          </p>
          <p className="mt-1 text-sm text-[var(--color-secondary)]">
            Tu pedido quedó registrado. Número{" "}
            <span className="font-bold text-[var(--color-texto)]">
              {shortOrderId(pedido.id)}
            </span>
          </p>
          <p className="mt-1 text-xs font-medium text-[var(--color-secondary)]">
            Pagás <span className="text-[var(--color-texto)]">{metodoLabel.toLowerCase()}</span>
          </p>
        </div>

        <div className="rounded-[var(--radio)] border border-[var(--color-borde)] surface-soft p-4 text-left">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
            Resumen
          </p>
          <ul className="mt-2 space-y-1.5">
            {items.map((i) => (
              <li key={`${i.producto_id}${i.talle || ""}`} className="flex justify-between gap-3 text-sm">
                <span className="truncate text-[var(--color-texto)]">
                  {i.nombre}
                  {i.talle && (
                    <span className="text-[var(--color-secondary)]"> · Talle {i.talle}</span>
                  )}{" "}
                  <span className="text-[var(--color-secondary)]">x{i.cantidad}</span>
                </span>
                <span className="shrink-0 font-semibold tabular-nums text-[var(--color-texto)]">
                  {formatPrice(i.precio_unitario * i.cantidad)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex justify-between gap-3 border-t border-[var(--color-borde)] pt-2 text-sm">
            <span className="font-medium text-[var(--color-texto)]">Total</span>
            <span className="font-bold tabular-nums text-[var(--color-texto)]">
              {formatPrice(subtotal)}
            </span>
          </div>
        </div>

        {metodoPago === "transferencia" && (
          <div
            className="overflow-hidden rounded-[var(--radio)] bg-[var(--color-tarjeta)] text-left shadow-sm ring-1 ring-[var(--color-borde)]"
            style={{ borderTop: "4px solid var(--color-primary)" }}
          >
            <div className="flex items-center gap-2.5 p-4 pb-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-lg">
                💸
              </span>
              <div>
                <p className="text-sm font-bold text-[var(--color-texto)]">
                  Transferí tu pedido
                </p>
                <p className="text-xs text-[var(--color-secondary)]">
                  Total a transferir:{" "}
                  <span className="font-bold tabular-nums text-[var(--color-texto)]">
                    {formatPrice(subtotal)}
                  </span>
                </p>
              </div>
            </div>

            {settings?.alias_transferencia || settings?.cbu_transferencia ? (
              <div className="space-y-2.5 p-4">
                {settings.alias_transferencia && (
                  <CopyField
                    label="Alias"
                    value={settings.alias_transferencia}
                    copyText="Copiar alias"
                  />
                )}
                {settings.cbu_transferencia && (
                  <CopyField
                    label="CBU"
                    value={settings.cbu_transferencia}
                    copyText="Copiar CBU"
                    mono
                  />
                )}
              </div>
            ) : (
              <p className="px-4 pb-4 pt-2 text-xs text-[var(--color-secondary)]">
                El negocio todavía no configuró los datos de transferencia. Podés
                coordinar por WhatsApp.
              </p>
            )}

            <div className="border-t border-[var(--color-borde)] surface-soft px-4 py-2.5">
              <p className="text-[11px] font-medium text-[var(--color-secondary)]">
                📌 Guardá el comprobante y adjuntalo cuando envíes tu pedido por
                WhatsApp.
              </p>
            </div>
          </div>
        )}

        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-[var(--radio)] py-3 text-sm font-bold text-[var(--color-primary-texto)] transition-all hover:opacity-90 active:scale-[0.99]"
            style={{ background: "var(--color-primary)" }}
          >
            Enviar pedido por WhatsApp
          </a>
        ) : (
          <p className="text-xs text-[var(--color-secondary)]">
            El negocio todavía no configuró WhatsApp para recibir pedidos.
          </p>
        )}

        {link && metodoPago === "transferencia" && (
          <p className="text-xs text-[var(--color-secondary)]">
            En el chat, adjuntá el comprobante de la transferencia.
          </p>
        )}

        {telefono && (
          <p className="text-xs text-[var(--color-secondary)]">
            O compartí el comprobante directo a{" "}
            <span className="font-semibold text-[var(--color-texto)]">
              {displayPhone(telefono)}
            </span>
          </p>
        )}

        <p className="text-xs text-[var(--color-secondary)]">
          Nuestro equipo va a confirmar tu pedido.
        </p>
      </div>
    </div>
  );
}
