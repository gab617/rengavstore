import { useState } from "react";
import { whatsAppLink } from "../../lib/pedidos";

const OPCIONES = [
  {
    id: "consulta",
    icon: "💬",
    label: "Quiero consultar",
    hint: "Preguntá lo que quieras",
    message: "¡Hola! Vengo de tu tienda y quería hacer una consulta.",
  },
  {
    id: "pedido",
    icon: "🧾",
    label: "Ya hice mi pedido",
    hint: "Consultá el estado de tu pedido",
    message:
      "¡Hola! Hice un pedido en tu tienda y quería consultar su estado. Mi pedido es el [NÚMERO].",
  },
];

export default function WhatsAppButton({ telefono }) {
  const [open, setOpen] = useState(false);

  if (!whatsAppLink(telefono, "x")) return null;

  return (
    <>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="fixed bottom-24 left-5 z-50 w-64 origin-bottom-left animate-scale-in overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200">
            <p className="px-4 pb-2 pt-3.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              ¿En qué te ayudamos?
            </p>
            <ul className="pb-1.5">
              {OPCIONES.map((o) => (
                <li key={o.id}>
                  <a
                    href={whatsAppLink(telefono, o.message)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366]/15 text-lg">
                      {o.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">{o.label}</p>
                      <p className="truncate text-xs text-gray-400">{o.hint}</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar menú de WhatsApp" : "Contactanos por WhatsApp"}
        className="fixed bottom-5 left-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl ring-4 ring-white/60 transition-all hover:bg-[#1fb857] hover:shadow-2xl active:scale-95"
      >
        {open ? (
          <svg
            className="h-7 w-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        )}
      </button>
    </>
  );
}
