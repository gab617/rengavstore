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
    <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-3">
      <div className="flex items-center justify-between gap-3">
        <p
          className={`select-all break-all text-base font-bold text-gray-900 ${
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
              : "text-white hover:opacity-90"
          }`}
          style={copied ? undefined : { background: "var(--color-primary)" }}
        >
          {copied ? "✓ Copiado" : `⧉ ${copyText}`}
        </button>
      </div>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
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
      <header className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3.5">
        <h2 className="font-display text-lg font-semibold tracking-tight text-gray-900">
          Pedido registrado
        </h2>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
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
          <p className="font-display text-lg font-semibold text-gray-900">
            ¡Gracias {cliente.nombre.split(" ")[0]}!
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Tu pedido quedó registrado. Número{" "}
            <span className="font-bold text-gray-900">
              {shortOrderId(pedido.id)}
            </span>
          </p>
          <p className="mt-1 text-xs font-medium text-gray-500">
            Pagás <span className="text-gray-900">{metodoLabel.toLowerCase()}</span>
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 text-left">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Resumen
          </p>
          <ul className="mt-2 space-y-1.5">
            {items.map((i) => (
              <li key={`${i.producto_id}${i.talle || ""}`} className="flex justify-between gap-3 text-sm">
                <span className="truncate text-gray-700">
                  {i.nombre}
                  {i.talle && (
                    <span className="text-gray-400"> · Talle {i.talle}</span>
                  )}{" "}
                  <span className="text-gray-400">x{i.cantidad}</span>
                </span>
                <span className="shrink-0 font-semibold tabular-nums text-gray-900">
                  {formatPrice(i.precio_unitario * i.cantidad)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex justify-between gap-3 border-t border-gray-200 pt-2 text-sm">
            <span className="font-medium text-gray-700">Total</span>
            <span className="font-bold tabular-nums text-gray-900">
              {formatPrice(subtotal)}
            </span>
          </div>
        </div>

        {metodoPago === "transferencia" && (
          <div
            className="overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-gray-200"
            style={{ borderTop: "4px solid var(--color-primary)" }}
          >
            <div className="flex items-center gap-2.5 p-4 pb-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-lg">
                💸
              </span>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Transferí tu pedido
                </p>
                <p className="text-xs text-gray-500">
                  Total a transferir:{" "}
                  <span className="font-bold tabular-nums text-gray-900">
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
              <p className="px-4 pb-4 pt-2 text-xs text-gray-500">
                El negocio todavía no configuró los datos de transferencia. Podés
                coordinar por WhatsApp.
              </p>
            )}

            <div className="border-t border-gray-100 bg-gray-50/70 px-4 py-2.5">
              <p className="text-[11px] font-medium text-gray-500">
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
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.99]"
            style={{ background: "var(--color-primary)" }}
          >
            Enviar pedido por WhatsApp
          </a>
        ) : (
          <p className="text-xs text-gray-400">
            El negocio todavía no configuró WhatsApp para recibir pedidos.
          </p>
        )}

        {link && metodoPago === "transferencia" && (
          <p className="text-xs text-gray-400">
            En el chat, adjuntá el comprobante de la transferencia.
          </p>
        )}

        {telefono && (
          <p className="text-xs text-gray-400">
            O compartí el comprobante directo a{" "}
            <span className="font-semibold text-gray-500">
              {displayPhone(telefono)}
            </span>
          </p>
        )}

        <p className="text-xs text-gray-400">
          Nuestro equipo va a confirmar tu pedido.
        </p>
      </div>
    </div>
  );
}
