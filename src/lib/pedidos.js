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
