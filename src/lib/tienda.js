const ARS = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
});

export function formatPrice(n) {
  if (n === null || n === undefined) return "Consultar";
  return ARS.format(n);
}

export const BADGES = {
  en_stock: {
    label: "Disponible",
    cls: "bg-green-50 text-green-700 ring-green-600/20",
    dot: "bg-green-500",
  },
  ultimas_unidades: {
    label: "Últimas unidades",
    cls: "bg-amber-50 text-amber-700 ring-amber-600/25",
    dot: "bg-amber-500",
  },
  agotado: {
    label: "Agotado",
    cls: "bg-red-50 text-red-600 ring-red-600/20",
    dot: "bg-red-500",
  },
};
