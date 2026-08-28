import { SocialLinks } from "./SocialLinks";

export default function StoreFooter({ tenant, settings }) {
  return (
    <footer className="hidden md:block mt-8 border-t border-gray-200/70 bg-white/60 py-6">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm font-medium text-gray-600">{tenant.nombre}</p>
          <p className="text-xs text-gray-400">{tenant.slug} · Tienda online</p>
          <SocialLinks settings={settings} variant="footer" />
        </div>
      </div>
    </footer>
  );
}