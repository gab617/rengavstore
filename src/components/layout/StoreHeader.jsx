import { SocialLinks } from "./SocialLinks";

export default function StoreHeader({ sucursal, tenant, settings, theme, logo, heroUrl, onOpenCategories }) {
  const primary = theme?.primary || "#2563eb";
  const heroContain = theme?.["hero-fit"] !== "cover";

  return (
    <header
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${primary} 0%, color-mix(in srgb, ${primary} 72%, #0f172a) 100%)`,
      }}
    >
      {heroUrl && (
        <div className="absolute inset-0">
          <img
            src={heroUrl}
            alt=""
            className="h-full w-full"
            style={{
              objectFit: theme?.["hero-fit"] || "cover",
              objectPosition: theme?.["hero-position"] || "center",
              transform: `scale(${theme?.["hero-zoom"] || 1})`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: heroContain
                ? `linear-gradient(135deg, color-mix(in srgb, ${primary} 52%, transparent) 0%, color-mix(in srgb, #0f172a 46%, transparent) 100%)`
                : `linear-gradient(135deg, color-mix(in srgb, ${primary} 72%, transparent) 0%, color-mix(in srgb, #0f172a 62%, transparent) 100%)`,
            }}
          />
        </div>
      )}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_-20%,rgba(255,255,255,0.14),transparent_45%)] pointer-events-none" />

      <div
        className="relative z-10 max-w-[1440px] mx-auto px-4 pt-8 pb-12 sm:pt-14 sm:pb-16"
        style={{
          color: "var(--color-primary-texto)",
          textShadow: heroUrl ? "0 1px 3px rgba(0,0,0,0.4)" : undefined,
        }}
      >
        <div className="flex items-center justify-between gap-3 sm:gap-5 mt-2 sm:mt-5">
          <div className="min-w-0">
            {logo && (
              <div className="mb-2 h-16 w-16 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-2xl ring-2 ring-white/30 bg-white/10 shadow-lg">
                <img
                  src={logo}
                  alt={sucursal.nombre}
                  loading="lazy"
                  className="h-full w-full"
                  style={{
                    objectFit: theme?.["logo-fit"] || "cover",
                    objectPosition: theme?.["logo-position"] || "center",
                    transform: `scale(${theme?.["logo-zoom"] || 1})`,
                  }}
                />
              </div>
            )}
            <div className="min-w-0">
              {!logo && (
                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] opacity-60">
                  {tenant.nombre}
                </p>
              )}
              <h1 className="font-display text-xl sm:text-4xl font-semibold tracking-tight leading-tight truncate">
                {sucursal.nombre}
              </h1>
              {settings?.lema && (
                <p className="mt-0.5 text-sm sm:text-base opacity-80">
                  {settings.lema}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex"><SocialLinks settings={settings} variant="header" /></div>
            {onOpenCategories && (
              <button
                onClick={onOpenCategories}
                className="flex shrink-0 h-10 w-10 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors md:hidden"
                aria-label="Filtrar categorías"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9h18" />
                  <path d="M3 15h18" />
                  <path d="M3 21h18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {settings?.descripcion && (
          <p className="mt-2.5 max-w-2xl text-sm opacity-70">
            {settings.descripcion}
          </p>
        )}
      </div>
    </header>
  );
}
