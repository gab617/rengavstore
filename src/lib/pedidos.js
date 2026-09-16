import { supabase } from "../services/supabaseClient";
import { formatPrice } from "./tienda";

export const METODO_PAGO_LABEL = {
  tienda: "Al retirar en la tienda",
  transferencia: "Por transferencia",
};

export async function crearPedido({ slug, cliente, items, metodoPago }) {
  const { data, error } = await supabase.rpc("pedido_crear", {
    p_slug: slug,
    p_cliente: cliente,
    p_items: items,
    p_metodo_pago: metodoPago,
  });
  if (error) throw error;
  return data;
}

export function shortOrderId(id) {
  return `#${id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
}

const LAST_ORDER_PREFIX = "comercio_tienda:last_order";
const LAST_ORDER_VERSION = 2;
const MAX_ORDERS = 3;

function lastOrderKey(slug) {
  return `${LAST_ORDER_PREFIX}:${slug}`;
}

function normalizeOrderEntry(entry) {
  if (!entry?.id) return null;
  return {
    id: entry.id,
    total: entry.total != null ? Number(entry.total) : null,
    metodoPago: entry.metodoPago || null,
    items: Array.isArray(entry.items) ? entry.items : [],
    fecha: entry.fecha || null,
  };
}

export function saveLastOrder(slug, { id, total, metodoPago, items }) {
  if (typeof window === "undefined" || !slug || !id) return;
  const resumenItems = Array.isArray(items)
    ? items.map((i) => ({
        nombre: String(i.nombre ?? ""),
        talle: i.talle || null,
        cantidad: Math.max(1, Math.floor(Number(i.cantidad) || 1)),
        precio_unitario: Number(i.precio_unitario) || 0,
      }))
    : [];
  const nuevo = normalizeOrderEntry({
    id,
    total: Number(total) || null,
    metodoPago: metodoPago || null,
    items: resumenItems,
    fecha: new Date().toISOString(),
  });
  if (!nuevo) return;
  try {
    const previos = loadLastOrders(slug).filter((o) => o.id !== id);
    const historial = [nuevo, ...previos].slice(0, MAX_ORDERS);
    window.localStorage.setItem(
      lastOrderKey(slug),
      JSON.stringify({ v: LAST_ORDER_VERSION, pedidos: historial }),
    );
  } catch {
    /* almacenamiento no disponible */
  }
}

export function loadLastOrders(slug) {
  if (typeof window === "undefined" || !slug) return [];
  try {
    const raw = window.localStorage.getItem(lastOrderKey(slug));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (parsed?.v === 2 && Array.isArray(parsed.pedidos)) {
      return parsed.pedidos
        .map(normalizeOrderEntry)
        .filter(Boolean)
        .slice(0, MAX_ORDERS);
    }
    if (parsed?.v === 1 && parsed?.id) {
      const migrado = normalizeOrderEntry(parsed);
      if (migrado) {
        try {
          window.localStorage.setItem(
            lastOrderKey(slug),
            JSON.stringify({ v: LAST_ORDER_VERSION, pedidos: [migrado] }),
          );
        } catch {
          /* almacenamiento no disponible */
        }
        return [migrado];
      }
    }
    return [];
  } catch {
    return [];
  }
}

export function loadLastOrder(slug) {
  return loadLastOrders(slug)[0] ?? null;
}

export function clearLastOrder(slug, id) {
  if (typeof window === "undefined" || !slug) return;
  try {
    const restantes = loadLastOrders(slug).filter((o) => o.id !== id);
    if (restantes.length === 0) {
      window.localStorage.removeItem(lastOrderKey(slug));
      return;
    }
    window.localStorage.setItem(
      lastOrderKey(slug),
      JSON.stringify({ v: LAST_ORDER_VERSION, pedidos: restantes }),
    );
  } catch {
    /* almacenamiento no disponible */
  }
}

export function buildWhatsAppMessage({
  sucursalNombre,
  pedido,
  items,
  subtotal,
  cliente,
  metodoPago,
}) {
  const lines = [
    `¡Hola ${sucursalNombre}! Hice un pedido en la tienda.`,
    "",
    `Pedido ${shortOrderId(pedido.id)}`,
    "Productos:",
    ...items.map(
      (i) =>
        `• ${i.nombre}${i.talle ? ` (Talle ${i.talle})` : ""} x${i.cantidad} — ${formatPrice(i.precio_unitario * i.cantidad)}`,
    ),
    `Total: ${formatPrice(subtotal)}`,
    `Forma de pago: ${METODO_PAGO_LABEL[metodoPago] ?? "Al retirar en la tienda"}`,
  ];
  if (metodoPago === "transferencia") {
    lines.push("Adjunto el comprobante de la transferencia.");
  }
  lines.push(
    "",
    "Mis datos:",
    `Nombre: ${cliente.nombre}`,
    `Teléfono: ${cliente.telefono}`,
  );
  if (cliente.email) lines.push(`Email: ${cliente.email}`);
  if (cliente.direccion) lines.push(`Dirección: ${cliente.direccion}`);
  if (cliente.notas) lines.push(`Notas: ${cliente.notas}`);
  return lines.join("\n");
}

export function whatsAppLink(telefono, message) {
  const digits = String(telefono || "").replace(/\D/g, "");
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function displayPhone(telefono) {
  const d = String(telefono || "").replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("549")) {
    const local = d.slice(3);
    if (local.length === 10) {
      return `+54 9 ${local.slice(0, 2)} ${local.slice(2, 6)} ${local.slice(6)}`;
    }
    return `+54 9 ${local}`;
  }
  return `+${d}`;
}
