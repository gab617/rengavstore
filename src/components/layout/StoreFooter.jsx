import { SocialLinks } from "./SocialLinks";

export default function StoreFooter({ tenant, settings }) {
  return (
    <footer className="hidden md:block mt-8 border-t border-[var(--color-borde)] surface-soft py-6">
      <div className="mx-auto max-w-[1440px] px-4">
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm font-medium text-[var(--color-texto)]">{tenant.nombre}</p>
          <p className="text-xs text-[var(--color-secondary)]">{tenant.slug} · Tienda online</p>
          <SocialLinks settings={settings} variant="footer" />
        </div>
      </div>
    </footer>
  );
}
