const THEME_DEFAULTS = {
  fondo: "#f9fafb",
  texto: "#111827",
  primary: "#2563eb",
  accent: "#db2777",
};

export function resolveTheme(settingsTheme) {
  const t = { ...THEME_DEFAULTS, ...(settingsTheme || {}) };
  return {
    ...t,
    style: {
      background: t.fondo,
      color: t.texto,
      "--color-primary": t.primary,
      "--color-accent": t.accent,
    },
  };
}
