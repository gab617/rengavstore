import { BADGES } from "../../lib/tienda";

export default function AvailabilityBadge({ disponibilidad }) {
  const b = BADGES[disponibilidad] || BADGES.en_stock;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${b.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${b.dot}`} />
      {b.label}
    </span>
  );
}
