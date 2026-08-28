import Chip from "../ui/Chip";

export default function SubcategoryChips({
  subcategorias,
  subcategoria,
  setSubcategoria,
}) {
  if (subcategorias.length <= 1) return null;
  return (
    <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1.5 mb-4">
      <Chip
        active={subcategoria === null}
        onClick={() => setSubcategoria(null)}
        className="py-1.5 text-xs"
      >
        Todas
      </Chip>
      {subcategorias.map((s) => (
        <Chip
          key={s.id}
          active={subcategoria === s.id}
          onClick={() => setSubcategoria(s.id)}
          className="py-1.5 text-xs"
        >
          {s.nombre} ({s.count})
        </Chip>
      ))}
    </div>
  );
}
