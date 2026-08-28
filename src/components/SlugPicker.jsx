import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SlugPicker() {
  const navigate = useNavigate();
  const [slug, setSlug] = useState("");

  const go = (e) => {
    e.preventDefault();
    const s = slug.trim().toLowerCase();
    if (s) navigate(`/${s}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <form
        onSubmit={go}
        className="w-full max-w-sm bg-white rounded-3xl shadow-xl shadow-gray-900/5 ring-1 ring-gray-900/5 p-8 animate-fade-in-up"
      >
        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 ring-1 ring-blue-600/20 flex items-center justify-center text-2xl">
          🛍️
        </div>
        <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight text-gray-900">
          Comercio Tienda
        </h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Escribí el slug de la sucursal para probar.
        </p>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="ej: abriel"
          autoFocus
          className="mt-6 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
        />
        <button
          type="submit"
          className="mt-4 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 active:scale-[0.99]"
        >
          Ver tienda
        </button>
      </form>
    </div>
  );
}
