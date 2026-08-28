import { useMemo, useState } from "react";

export default function useCatalogFilter(catalogo) {
  const [categoria, setCategoria] = useState(null);
  const [subcategoria, setSubcategoria] = useState(null);
  const [q, setQ] = useState("");

  const visibles = useMemo(
    () => catalogo.filter((p) => p.visible !== false),
    [catalogo],
  );

  const categorias = useMemo(() => {
    const map = new Map();
    for (const p of visibles) {
      const c = p.categoria;
      const key = c?.id ?? "none";
      const label = c?.nombre ?? "Sin categoría";
      if (!map.has(key)) map.set(key, { id: key, nombre: label, count: 0 });
      map.get(key).count++;
    }
    return [...map.values()].sort((a, b) =>
      a.nombre.localeCompare(b.nombre, "es")
    );
  }, [visibles]);

  const subcategorias = useMemo(() => {
    const map = new Map();
    for (const p of visibles) {
      if (categoria !== null && (p.categoria?.id ?? "none") !== categoria) {
        continue;
      }
      const sc = p.subcategoria;
      const key = sc?.id ?? "none";
      const label = sc?.nombre ?? "Otros";
      if (!map.has(key)) map.set(key, { id: key, nombre: label, count: 0 });
      map.get(key).count++;
    }
    return [...map.values()].sort((a, b) => {
      if (a.id === "none") return 1;
      if (b.id === "none") return -1;
      return a.nombre.localeCompare(b.nombre, "es");
    });
  }, [visibles, categoria]);

  const destacados = useMemo(
    () => visibles.filter((p) => p.destacado === true),
    [visibles],
  );

  const filtrados = useMemo(() => {
    const term = q.trim().toLowerCase();
    return visibles.filter((p) => {
      if (categoria !== null && (p.categoria?.id ?? "none") !== categoria) {
        return false;
      }
      if (
        subcategoria !== null &&
        (p.subcategoria?.id ?? "none") !== subcategoria
      ) {
        return false;
      }
      if (term) {
        const hay = `${p.nombre} ${p.marca || ""}`
          .toLowerCase()
          .includes(term);
        if (!hay) return false;
      }
      return true;
    });
  }, [visibles, categoria, subcategoria, q]);

  return {
    visibles,
    categorias,
    subcategorias,
    destacados,
    filtrados,
    categoria,
    setCategoria,
    subcategoria,
    setSubcategoria,
    q,
    setQ,
  };
}