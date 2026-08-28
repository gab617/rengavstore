export const SOCIAL_PLATFORMS = [
  {
    key: "instagram_url",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
    normalize: (url) => {
      if (!url) return null;
      const clean = url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
      if (clean.includes("instagram.com")) return `https://${clean}`;
      return `https://instagram.com/${clean.replace(/^@/, "")}`;
    },
  },
  {
    key: "facebook_url",
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.046V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    normalize: (url) => {
      if (!url) return null;
      const clean = url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
      if (clean.includes("facebook.com")) return `https://${clean}`;
      return `https://facebook.com/${clean}`;
    },
  },
  {
    key: "x_url",
    label: "X (Twitter)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.7 4.5l-5.7 7.1 5.7 7.1-1.8 1.8-5.7-7.1-5.7 7.1-1.8-1.8 5.7-7.1-5.7-7.1 1.8-1.8 5.7 7.1 5.7-7.1z" />
      </svg>
    ),
    normalize: (url) => {
      if (!url) return null;
      const clean = url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
      if (clean.includes("x.com") || clean.includes("twitter.com")) return `https://${clean}`;
      return `https://x.com/${clean.replace(/^@/, "")}`;
    },
  },
  {
    key: "tiktok_url",
    label: "TikTok",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.545,2.027c2.559,0,4.47,2.152,4.47,4.831c0,2.625-2.069,4.649-4.289,4.649c-2.41,0-4.624-2.061-4.624-4.578C8.154,6.847,10.08,4.819,12.545,2.027z M12.545,0C8.021,0,4.155,4.086,4.155,8.889c0,4.802,3.865,8.889,8.39,8.889c4.543,0,8.39-4.086,8.39-8.889C20.945,4.086,17.068,0,12.545,0z M11.931,18.84c-2.172,0-3.727-1.745-3.727-3.851c0-2.278,1.566-3.864,3.727-3.864c1.918,0,3.727,1.541,3.727,3.792C15.711,17.107,14.047,18.84,11.931,18.84L11.931,18.84z" />
      </svg>
    ),
    normalize: (url) => {
      if (!url) return null;
      const clean = url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
      if (clean.includes("tiktok.com")) return `https://${clean}`;
      return `https://tiktok.com/@${clean.replace(/^@/, "")}`;
    },
  },
  {
    key: "youtube_url",
    label: "YouTube",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM10 15.167V8.833L16.25 12 10 15.167z" />
      </svg>
    ),
    normalize: (url) => {
      if (!url) return null;
      const clean = url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
      if (clean.includes("youtube.com") || clean.includes("youtu.be")) return `https://${clean}`;
      return `https://youtube.com/${clean}`;
    },
  },
  {
    key: "linkedin_url",
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.36-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.07-.926-2.07-2.065 0-1.138.926-2.065 2.07-2.065 1.143 0 2.064.927 2.064 2.065 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    normalize: (url) => {
      if (!url) return null;
      const clean = url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
      if (clean.includes("linkedin.com")) return `https://${clean}`;
      return `https://linkedin.com/in/${clean}`;
    },
  },
  {
    key: "web_url",
    label: "Web",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    normalize: (url) => {
      if (!url) return null;
      const clean = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
      if (clean.startsWith("http")) return url;
      return `https://${clean}`;
    },
  },
];

function normalizeUrl(raw, platform) {
  if (!raw || !raw.trim()) return null;
  const platformDef = SOCIAL_PLATFORMS.find((p) => p.key === platform);
  if (!platformDef) return null;
  try {
    return platformDef.normalize(raw.trim());
  } catch {
    return null;
  }
}

export function getSocialLinks(settings) {
  if (!settings) return [];
  return SOCIAL_PLATFORMS.map((p) => {
    const raw = settings[p.key];
    const href = normalizeUrl(raw, p.key);
    return href ? { ...p, href } : null;
  }).filter(Boolean);
}

export function SocialLinks({ settings, variant = "default", className = "" }) {
  const links = getSocialLinks(settings);
  if (!links.length) return null;

  const baseStyles = "flex items-center justify-center gap-1.5";
  const variantStyles = {
    default: "flex gap-2",
    mobile: "flex gap-3 p-2",
    header: "flex gap-1.5",
    footer: "flex gap-3",
  };

  return (
    <nav className={`${baseStyles} ${variantStyles[variant] || variantStyles.default} ${className}`} aria-label="Redes sociales">
      {links.map((link) => (
        <a
          key={link.key}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all hover:scale-110 active:scale-95 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 ${variant === "mobile" ? "bg-white/90 backdrop-blur-sm shadow-sm" : variant === "header" ? "bg-white/10 hover:bg-white/20 text-white" : variant === "footer" ? "text-gray-400 hover:text-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
        >
          {link.icon}
        </a>
      ))}
    </nav>
  );
}