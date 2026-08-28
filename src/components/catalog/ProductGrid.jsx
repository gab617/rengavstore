import ProductCard from "./ProductCard";

export default function ProductGrid({ productos, onOpen, theme }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
      {productos.map((p) => (
        <ProductCard key={p.id} p={p} onOpen={() => onOpen(p)} theme={theme} />
      ))}
    </div>
  );
}
