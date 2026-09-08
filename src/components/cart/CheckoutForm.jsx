import { useState } from "react";
import useCart from "../../hooks/useCart";
import { crearPedido, METODO_PAGO_LABEL } from "../../lib/pedidos";
import { formatPrice } from "../../lib/tienda";

const METODOS = [
  { value: "tienda", label: "Al retirar en la tienda" },
  { value: "transferencia", label: "Por transferencia" },
];

const INITIAL = {
  nombre: "",
  telefono: "",
  email: "",
  direccion: "",
  notas: "",
  honeypot: "",
};

const ERROR_MSGS = {
  producto_invalido:
    "Uno de los productos ya no está disponible. Actualizá el carrito y volvé a intentar.",
  items_vacios: "Tu carrito está vacío.",
  cliente_incompleto: "Completá tu nombre y teléfono.",
  cliente_invalido: "Los datos del cliente no son válidos.",
  demasiados_pedidos:
    "Hiciste demasiados pedidos en poco tiempo. Esperá un rato y volvé a intentar.",
  spam_detectado: "No se pudo registrar el pedido.",
  metodo_pago_invalido: "Elegí una forma de pago válida.",
};

export default function CheckoutForm({ slug, sucursalNombre, onSuccess, onBack, onClose }) {
  const { items, subtotal } = useCart();
  const [form, setForm] = useState(INITIAL);
  const [metodoPago, setMetodoPago] = useState("transferencia");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = "Ingresá tu nombre";
    if (!form.telefono.trim()) {
      errs.telefono = "Ingresá tu teléfono";
    } else if (form.telefono.replace(/\D/g, "").length < 8) {
      errs.telefono = "Teléfono inválido";
    }
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = "Email inválido";
    }
    return errs;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const payload = items.map((i) => ({
      producto_id: i.id,
      nombre: i.nombre,
      marca: i.marca,
      cantidad: i.quantity,
      precio_unitario: i.unitPrice,
      imagen: i.image,
      talle: i.talle || null,
    }));

    const cliente = {
      nombre: form.nombre.trim(),
      telefono: form.telefono.trim(),
      email: form.email.trim() || null,
      direccion: form.direccion.trim() || null,
      notas: form.notas.trim() || null,
      honeypot: form.honeypot,
    };

    setLoading(true);
    setError(null);
    try {
      const pedido = await crearPedido({ slug, cliente, items: payload, metodoPago });
      if (pedido?.error) {
        setError(ERROR_MSGS[pedido.error] || "No se pudo registrar el pedido.");
        return;
      }
      onSuccess({ pedido, cliente, items: payload, subtotal, metodoPago });
    } catch {
      setError("Ocurrió un error al registrar el pedido. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (field) =>
    `w-full rounded-[var(--radio)] border bg-[var(--color-tarjeta)] px-3.5 py-2.5 text-sm text-[var(--color-texto)] placeholder:text-[var(--color-secondary)] transition-shadow focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent ${
      errors[field] ? "border-red-300" : "border-[var(--color-borde)]"
    }`;

  return (
    <form onSubmit={submit} className="flex flex-1 flex-col overflow-hidden">
      <header className="flex shrink-0 items-center justify-between border-b border-[var(--color-borde)] px-4 py-3.5">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-secondary)] transition-colors hover:bg-gray-100 hover:text-[var(--color-texto)]"
          aria-label="Volver al carrito"
        >
          ←
        </button>
        <h2 className="font-display text-lg font-semibold tracking-tight text-[var(--color-texto)]">
          Tus datos
        </h2>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-secondary)] transition-colors hover:bg-gray-100 hover:text-[var(--color-texto)]"
          aria-label="Cerrar carrito"
        >
          ✕
        </button>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        <input
          type="text"
          value={form.honeypot}
          onChange={set("honeypot")}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />

        <div className="rounded-[var(--radio)] surface-soft px-3.5 py-2.5 text-xs text-[var(--color-secondary)]">
          Pedido para{" "}
          <span className="font-semibold text-[var(--color-texto)]">{sucursalNombre}</span> ·
          {items.length} {items.length === 1 ? "producto" : "productos"} ·{" "}
          <span className="font-semibold tabular-nums text-[var(--color-texto)]">
            {formatPrice(subtotal)}
          </span>
          {items.some((i) => i.talle) && (
            <span className="ml-1 text-[var(--color-secondary)]">
              (con talles)
            </span>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-[var(--color-texto)]">
            ¿Cómo vas a pagar?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {METODOS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMetodoPago(m.value)}
                className={`rounded-[var(--radio)] px-3 py-2.5 text-sm font-semibold transition-all ${
                  metodoPago === m.value
                    ? "text-[var(--color-primary-texto)]"
                    : "text-[var(--color-secondary)] ring-1 ring-inset ring-[var(--color-borde)] hover:surface-soft"
                }`}
                style={
                  metodoPago === m.value
                    ? { background: "var(--color-primary)" }
                    : undefined
                }
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-[var(--color-texto)]">
            Nombre *
          </label>
          <input
            value={form.nombre}
            onChange={set("nombre")}
            placeholder="Tu nombre"
            className={inputCls("nombre")}
          />
          {errors.nombre && (
            <p className="mt-1 text-xs text-red-500">{errors.nombre}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-[var(--color-texto)]">
            Teléfono *
          </label>
          <input
            value={form.telefono}
            onChange={set("telefono")}
            placeholder="Ej: 11 5555 1234"
            inputMode="tel"
            className={inputCls("telefono")}
          />
          {errors.telefono && (
            <p className="mt-1 text-xs text-red-500">{errors.telefono}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-[var(--color-texto)]">
            Email
          </label>
          <input
            value={form.email}
            onChange={set("email")}
            placeholder="tu@email.com"
            inputMode="email"
            className={inputCls("email")}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-[var(--color-texto)]">
            Dirección
          </label>
          <input
            value={form.direccion}
            onChange={set("direccion")}
            placeholder="Calle y número"
            className={inputCls("direccion")}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-[var(--color-texto)]">
            Notas
          </label>
          <textarea
            value={form.notas}
            onChange={set("notas")}
            placeholder="Algún detalle para tu pedido (opcional)"
            rows="2"
            className={inputCls("notas")}
          />
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-600">
            {error}
          </p>
        )}
      </div>

      <footer className="flex shrink-0 items-center gap-2 border-t border-[var(--color-borde)] p-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-[var(--radio)] px-4 py-2.5 text-sm font-semibold text-[var(--color-secondary)] ring-1 ring-inset ring-[var(--color-borde)] transition-colors hover:surface-soft"
        >
          Volver
        </button>
        <button
          type="submit"
          disabled={loading || items.length === 0}
          className="flex-1 rounded-[var(--radio)] py-2.5 text-sm font-semibold text-[var(--color-primary-texto)] transition-all hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: "var(--color-primary)" }}
        >
          {loading ? "Registrando..." : "Registrar pedido"}
        </button>
      </footer>
    </form>
  );
}
