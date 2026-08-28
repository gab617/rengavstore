import { useCallback, useEffect, useMemo, useState } from "react";
import { loadCart, saveCart } from "../lib/cartStorage";
import { CartContext } from "./CartContext";

function canAdd(product) {
  return product?.disponibilidad !== "agotado" && product?.precio_venta != null;
}

function itemKey(id, talle) {
  return talle ? `${id}::${talle}` : `${id}`;
}

function cartItemFromProduct(p, quantity, talle) {
  const image = (p.imagenes || []).find(Boolean) ?? null;
  return {
    id: p.id,
    talle: talle || null,
    nombre: p.nombre,
    marca: p.marca || "",
    unitPrice: p.precio_venta ?? 0,
    image,
    quantity,
  };
}

export default function CartProvider({ slug, children }) {
  const [items, setItems] = useState(() => loadCart(slug));

  useEffect(() => {
    saveCart(slug, items);
  }, [slug, items]);

  const addItem = useCallback((product, quantity = 1, talle) => {
    if (!product?.id) return;
    if (!canAdd(product)) return;
    const qty = Math.max(1, Math.floor(quantity));
    const t = talle || null;
    setItems((prev) => {
      const key = itemKey(product.id, t);
      const existing = prev.find((i) => itemKey(i.id, i.talle) === key);
      if (!existing) {
        return [...prev, cartItemFromProduct(product, qty, t)];
      }
      return prev.map((i) =>
        itemKey(i.id, i.talle) === key
          ? { ...i, quantity: i.quantity + qty }
          : i,
      );
    });
  }, []);

  const removeItem = useCallback((id, talle) => {
    const t = talle || null;
    setItems((prev) =>
      prev.filter((i) => itemKey(i.id, i.talle) !== itemKey(id, t)),
    );
  }, []);

  const setQuantity = useCallback((id, quantity, talle) => {
    const qty = Math.max(1, Math.floor(quantity));
    const t = talle || null;
    setItems((prev) =>
      prev.map((i) =>
        itemKey(i.id, i.talle) === itemKey(id, t)
          ? { ...i, quantity: qty }
          : i,
      ),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const has = useCallback(
    (id, talle) => {
      const t = talle || null;
      return items.some((i) => itemKey(i.id, i.talle) === itemKey(id, t));
    },
    [items],
  );

  const getQuantity = useCallback(
    (id, talle) => {
      const t = talle || null;
      return items.find((i) => itemKey(i.id, i.talle) === itemKey(id, t))
        ?.quantity ?? 0;
    },
    [items],
  );

  const count = useMemo(
    () => items.reduce((acc, i) => acc + i.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      addItem,
      removeItem,
      setQuantity,
      clear,
      has,
      getQuantity,
      canAdd,
    }),
    [items, count, subtotal, addItem, removeItem, setQuantity, clear, has, getQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
