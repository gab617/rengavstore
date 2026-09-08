const THEME_DEFAULTS = {
  primary: "#2563eb",
  "primary-texto": "#ffffff",
  secondary: "#64748b",
  accent: "#db2777",
  fondo: "#f9fafb",
  tarjeta: "#ffffff",
  texto: "#111827",
  borde: "#e5e7eb",
  radio: "1rem",
  "columnas-grid": "3",
  "logo-fit": "cover",
  "logo-zoom": "1",
  "logo-position": "center",
  "hero-fit": "contain",
  "hero-zoom": "1",
  "hero-position": "center",
};

export function themeVars(t) {
  return {
    "--color-primary": t.primary,
    "--color-primary-texto": t["primary-texto"],
    "--color-secondary": t.secondary,
    "--color-accent": t.accent,
    "--color-fondo": t.fondo,
    "--color-tarjeta": t.tarjeta,
    "--color-texto": t.texto,
    "--color-borde": t.borde,
    "--radio": t.radio,
    "--columnas-grid": t["columnas-grid"],
    ...(t["font-titulos"] ? { "--font-display": t["font-titulos"] } : {}),
    ...(t["font-cuerpo"] ? { "--font-sans": t["font-cuerpo"] } : {}),
  };
}

export function resolveTheme(settingsTheme) {
  const src = settingsTheme || {};
  const merged = { ...THEME_DEFAULTS, ...src };
  const t = {};
  for (const [key, fallback] of Object.entries(THEME_DEFAULTS)) {
    const value = merged[key];
    t[key] = typeof value === "string" && value.trim() === "" ? fallback : value;
  }
  t["font-titulos"] = src["font-titulos"];
  t["font-cuerpo"] = src["font-cuerpo"];
  const vars = themeVars(t);
  return {
    ...t,
    vars,
    style: {
      background: t.fondo,
      color: t.texto,
      ...(t["font-cuerpo"] ? { fontFamily: t["font-cuerpo"] } : {}),
      ...vars,
    },
  };
}