import { SocialLinks } from "./SocialLinks";

export default function StoreHeader({ sucursal, tenant, settings, logo, heroUrl, onOpenCategories }) {
  const primary = settings?.theme?.primary || "#2563eb";

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
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, color-mix(in srgb, ${primary} 72%, transparent) 0%, color-mix(in srgb, #0f172a 62%, transparent) 100%)`,
            }}
          />
        </div>
      )}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_-20%,rgba(255,255,255,0.14),transparent_45%)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 py-4 sm:py-12 text-white">
        <div className="flex items-center justify-between gap-3 sm:gap-5 mt-2 sm:mt-5">
          <div className="min-w-0">
            {logo && (
              <img
                src={logo}
                alt={sucursal.nombre}
                className="h-12 w-12 sm:h-20 sm:w-20 rounded-2xl object-cover ring-2 ring-white/30 bg-white/10 shadow-lg shrink-0"
              />
            )}
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                {tenant.nombre}
              </p>
              <h1 className="font-display text-xl sm:text-4xl font-semibold tracking-tight leading-tight truncate">
                {sucursal.nombre}
              </h1>
              {settings?.lema && (
                <p className="mt-0.5 text-sm sm:text-base text-white/80">
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
                className="flex shrink-0 h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors md:hidden"
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
          <p className="mt-2.5 max-w-2xl text-sm text-white/70">
            {settings.descripcion}
          </p>
        )}
      </div>
    </header>
  );
}
