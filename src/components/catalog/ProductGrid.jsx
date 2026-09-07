import ProductCard from "./ProductCard";

const GRID_LG = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

export default function ProductGrid({ productos, onOpen, theme }) {
  const lg = GRID_LG[theme?.["columnas-grid"]] || "lg:grid-cols-3";

  return (
    <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 ${lg}`}>
      {productos.map((p) => (
        <ProductCard key={p.id} p={p} onOpen={() => onOpen(p)} theme={theme} />
      ))}
    </div>
  );
}