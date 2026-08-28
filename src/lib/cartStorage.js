const PREFIX = "comercio_tienda:cart";
const VERSION = 2;

export function cartStorageKey(slug) {
  return `${PREFIX}:${slug}`;
}

export function loadCart(slug) {
  if (typeof window === "undefined") return [];
  const key = cartStorageKey(slug);
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (parsed?.v !== VERSION || !Array.isArray(parsed.items)) {
      if (parsed?.v === 1 && Array.isArray(parsed.items)) {
        return normalizeItems(parsed.items);
      }
      return [];
    }
    return normalizeItems(parsed.items);
  } catch {
    return [];
  }
}

export function saveCart(slug, items) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      cartStorageKey(slug),
      JSON.stringify({ v: VERSION, items }),
    );
  } catch {
    /* almacenamiento no disponible */
  }
}

export function clearCart(slug) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(cartStorageKey(slug));
  } catch {
    /* almacenamiento no disponible */
  }
}

function normalizeItems(items) {
  const map = new Map();
  for (const raw of items) {
    const id = raw?.id;
    if (typeof id !== "string" && typeof id !== "number") continue;
    const quantity = Math.max(1, Math.floor(Number(raw.quantity) || 1));
    const talle = raw.talle || null;
    const key = talle ? `${id}::${talle}` : `${id}`;
    const prev = map.get(key);
    map.set(key, {
      id,
      talle,
      nombre: String(raw.nombre ?? ""),
      marca: String(raw.marca ?? ""),
      unitPrice: Number(raw.unitPrice) || 0,
      image: raw.image ?? null,
      quantity: prev ? prev.quantity + quantity : quantity,
    });
  }
  return [...map.values()];
}
