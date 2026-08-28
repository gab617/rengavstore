import Chip from "../ui/Chip";

export default function MobileCategoryChips({
  categorias,
  categoria,
  setCategoria,
  total,
}) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1.5 md:hidden">
      <Chip active={categoria === null} onClick={() => setCategoria(null)}>
        Todas ({total})
      </Chip>
      {categorias.map((c) => (
        <Chip
          key={c.id}
          active={categoria === c.id}
          onClick={() => setCategoria(c.id)}
        >
          {c.nombre} ({c.count})
        </Chip>
      ))}
    </div>
  );
}