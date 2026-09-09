import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SlugPicker({ logo }) {
  const navigate = useNavigate();
  const [slug, setSlug] = useState("");
  const [entering, setEntering] = useState(false);

  const go = (e) => {
    e.preventDefault();
    const s = slug.trim().toLowerCase();
    if (!s || entering) return;
    setEntering(true);
    setTimeout(() => navigate(`/${s}`), 900);
  };

  return (
    <>
    <div className="min-h-screen flex items-center justify-center px-4 bg-[radial-gradient(circle_at_20%_15%,_rgba(255,255,255,0.7)_0%,_transparent_50%),_radial-gradient(circle_at_85%_85%,_rgba(56,189,248,0.4)_0%,_transparent_55%),_linear-gradient(180deg,_#bae6fd_0%,_#e0f2fe_50%,_#dbeafe_100%)]">
      <div className="relative w-full max-w-md">
        <div
          aria-hidden="true"
          className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-tr from-sky-300/50 via-blue-200/40 to-blue-500/50 blur-2xl"
        />
        <form
          onSubmit={go}
          className="relative w-full bg-white/85 backdrop-blur-xl rounded-3xl shadow-[0_25px_70px_-15px_rgba(30,64,175,0.35)] ring-1 ring-white/70 p-8 sm:p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_35px_90px_-15px_rgba(30,64,175,0.45)]"
        >
        {/* Logo + Marca */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/30 flex items-center justify-center overflow-hidden shrink-0">
            {logo ? (
              <img
                src={logo}
                alt="Logo de la tienda"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl text-white">🛍️</span>
            )}
          </div>
          <div className="leading-none select-none">
            <span className="block text-[11px] font-black uppercase tracking-[0.22em] text-blue-900/60 [text-shadow:0_1px_0_rgba(255,255,255,0.9),0_-1px_0_rgba(23,37,84,0.2)]">
              Tiendas
            </span>
            <span className="mt-1 block text-xl font-black italic tracking-tight text-sky-900/80 [text-shadow:0_1px_0_rgba(255,255,255,0.9),0_-1px_1px_rgba(23,37,84,0.3)]">
              Rengav
            </span>
          </div>
        </div>

        {/* Título y Descripción */}
        <div className="mt-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            ¡Bienvenido/a!
          </h1>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            Escribí el <span className="font-semibold text-gray-800">nombre de la tienda</span> que querés visitar y mirá todos sus productos.
          </p>
        </div>

        {/* Input con Prefijo Visual */}
        <div className="mt-8 space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
            Nombre de la tienda <span className="text-blue-500">*</span>
          </label>
          <div className="relative flex items-center rounded-2xl border-2 border-blue-300 bg-white shadow-md shadow-blue-500/10 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20 transition-all">
            <span className="pl-4 pr-1 text-sm font-medium text-blue-900/50 select-none">
              tienda.com/
            </span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              autoFocus
              placeholder="ej: la-casa-del-pan"
              className="w-full bg-transparent py-3 pr-3 text-sm text-gray-900 placeholder:text-blue-900/30 focus:outline-none"
            />
            <svg
              className="mr-3 h-4 w-4 shrink-0 animate-pulse text-blue-500/70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
        </div>

        {/* Botón de Acción */}
        <button
          type="submit"
          disabled={!slug.trim()}
          className="mt-6 w-full group relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/35 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Ingresar a la Tienda</span>
          <svg
            className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </form>
    </div>
  </div>

      {entering && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(circle_at_20%_15%,_rgba(255,255,255,0.7)_0%,_transparent_50%),_radial-gradient(circle_at_85%_85%,_rgba(56,189,248,0.4)_0%,_transparent_55%),_linear-gradient(180deg,_#bae6fd_0%,_#e0f2fe_50%,_#dbeafe_100%)]">
          <div className="relative mx-6 flex w-full max-w-sm flex-col items-center rounded-3xl bg-white/70 p-10 shadow-[0_25px_70px_-15px_rgba(30,64,175,0.4)] ring-1 ring-white/70 backdrop-blur-xl">
            <div className="relative flex h-28 w-28 items-center justify-center">
              <svg className="h-full w-full -rotate-90 animate-spin" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="loaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="44" fill="none" stroke="#e0f2fe" strokeWidth="7" />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="url(#loaderGrad)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray="276"
                  strokeDashoffset="215"
                />
              </svg>
              <div className="absolute flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/30">
                {logo ? (
                  <img
                    src={logo}
                    alt="Logo de la tienda"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl text-white">🛍️</span>
                )}
              </div>
            </div>

            <p className="mt-8 text-base font-semibold text-gray-800">
              Ingresando a tu tienda
            </p>

            <div className="mt-3 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500 [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500 [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}