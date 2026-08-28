import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import useStorefront from "../hooks/useStorefront";
import useCatalogFilter from "../hooks/useCatalogFilter";
import useCart from "../hooks/useCart";
import { publicUrl } from "../lib/storefront";
import { resolveTheme } from "../lib/theme";
import CartProvider from "../context/CartProvider";
import StoreHeader from "./layout/StoreHeader";
import StoreFooter from "./layout/StoreFooter";
import CategorySidebar from "./catalog/CategorySidebar";
import MobileCategoryChips from "./catalog/MobileCategoryChips";
import SubcategoryChips from "./catalog/SubcategoryChips";
import CatalogToolbar from "./catalog/CatalogToolbar";
import Breadcrumb from "./catalog/Breadcrumb";
import CatalogEmpty from "./catalog/CatalogEmpty";
import CatalogSkeleton from "./catalog/CatalogSkeleton";
import FeaturedSection from "./catalog/FeaturedSection";
import ProductGrid from "./catalog/ProductGrid";
import ProductModal from "./catalog/ProductModal";
import CartDrawer from "./cart/CartDrawer";
import CartBadge from "./cart/CartBadge";
import WhatsAppButton from "./layout/WhatsAppButton";
import CategoryBottomSheet from "./catalog/CategoryBottomSheet";

function LoadingScreen() {
  return (
    <div className="min-h-screen">
      <div className="h-40 animate-pulse bg-gray-200/70 sm:h-52" />
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="mb-5 h-10 w-2/3 max-w-xs animate-pulse rounded-xl bg-gray-200/70" />
        <CatalogSkeleton />
      </div>
    </div>
  );
}

function ErrorScreen({ error }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-2xl">
        🧭
      </div>
      <p className="mt-4 text-base font-semibold text-gray-900">
        {error === "sucursal_no_encontrada"
          ? "Sucursal no encontrada"
          : "Ocurrió un error"}
      </p>
      <p className="mt-1 text-sm text-gray-500">{error}</p>
      <Link
        to="/"
        className="mt-5 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
      >
        Elegir otra tienda
      </Link>
    </div>
  );
}

function StorefrontView({ slug }) {
  const { loading, error, sucursal, catalogo } = useStorefront(slug);
  const [productoActivo, setProductoActivo] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [catSheetOpen, setCatSheetOpen] = useState(false);
  const { count } = useCart();

  const filter = useCatalogFilter(catalogo);
  const {
    visibles,
    subcategorias,
    destacados,
    filtrados,
    categoria,
    setCategoria,
    subcategoria,
    setSubcategoria,
    q,
    setQ,
  } = filter;

  const categorias = filter.categorias;

  const selectCategoria = (id) => {
    setCategoria(id);
    setSubcategoria(null);
  };

  const handleCategorySelect = (cat) => {
    selectCategoria(cat.id);
    setCatSheetOpen(false);
  };

  const verCategoriaDe = (p) => {
    setQ("");
    selectCategoria(p.categoria?.id ?? null);
  };

  if (loading) return <LoadingScreen />;

  if (error) return <ErrorScreen error={error} />;

  const set = sucursal.settings;
  const theme = resolveTheme(set?.theme);
  const logo = set?.logo_url ? publicUrl(set.logo_url) : null;
  const heroUrl = set?.hero_url ? publicUrl(set.hero_url) : null;
  const categoriaSel = categorias.find((c) => c.id === categoria);

  return (
      <div style={theme.style} className="min-h-screen">
        <StoreHeader
          sucursal={sucursal.sucursal}
          tenant={sucursal.tenant}
          settings={set}
          logo={logo}
          heroUrl={heroUrl}
          onOpenCategories={() => setCatSheetOpen(true)}
        />

      <div className="mx-auto flex max-w-6xl items-start gap-8 px-4 py-4 sm:py-8">
        <CategorySidebar
          categorias={categorias}
          categoria={categoria}
          setCategoria={selectCategoria}
          total={visibles.length}
        />

        <main className="min-w-0 flex-1 pb-24">
          {!categoria && !q && destacados.length > 0 && (
            <FeaturedSection
              productos={destacados}
              onOpen={setProductoActivo}
              onSeeCategory={verCategoriaDe}
              theme={theme}
            />
          )}

          <div className="mb-3 sm:mb-6">
            <MobileCategoryChips
              categorias={categorias}
              categoria={categoria}
              setCategoria={selectCategoria}
              total={visibles.length}
            />
            <CatalogToolbar
              q={q}
              setQ={setQ}
              filtrados={filtrados.length}
              total={visibles.length}
            />
          </div>

          {categoriaSel && (
            <div className="mb-2">
              <Breadcrumb
                nombre={categoriaSel.nombre}
                onHome={() => selectCategoria(null)}
              />
            </div>
          )}

          <SubcategoryChips
            subcategorias={subcategorias}
            subcategoria={subcategoria}
            setSubcategoria={setSubcategoria}
          />

          {filtrados.length === 0 ? (
            <CatalogEmpty q={q} onClear={q ? () => setQ("") : undefined} />
          ) : (
            <ProductGrid productos={filtrados} onOpen={setProductoActivo} theme={theme} />
          )}
        </main>
      </div>

      <StoreFooter tenant={sucursal.tenant} />

      {productoActivo && (
        <ProductModal
          p={productoActivo}
          onClose={() => setProductoActivo(null)}
          theme={theme}
        />
      )}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        primary={theme.primary}
        slug={slug}
        sucursalNombre={sucursal.sucursal.nombre}
        settings={set}
      />

      {!cartOpen && (
        <CartBadge
          count={count}
          primary={theme.primary}
          onClick={() => setCartOpen(true)}
        />
      )}

      <WhatsAppButton telefono={set?.telefono_whatsapp} />

        <CategoryBottomSheet
          isOpen={catSheetOpen}
          onClose={() => setCatSheetOpen(false)}
          onSelect={handleCategorySelect}
          categorias={categorias}
          activeCategoryId={categoria}
          settings={set}
        />
      </div>
  );
}

export default function Storefront() {
  const { slug } = useParams();
  return (
    <CartProvider key={slug} slug={slug}>
      <StorefrontView slug={slug} />
    </CartProvider>
  );
}
