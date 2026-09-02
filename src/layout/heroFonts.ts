export type HeroFontCategory = "serif" | "sans" | "mono" | "display";

export type HeroFont = {
  /** CSS font-family name, must match the Google Fonts family. */
  family: string;
  /** Font weight to load + render. */
  weight: number;
  /** Rough classification, used to pick a sensible fallback stack. */
  category: HeroFontCategory;
  /** Per-font tracking so each typeface sits nicely at hero size. */
  letterSpacing?: string;
  /**
   * Override the Google Fonts URL spec (the `family=` value).
   * Defaults to `<Family>:wght@<weight>`. Set to `null` to skip loading
   * (e.g. for a font that is already bundled / system-available).
   */
  googleSpec?: string | null;
  /** Override the fallback stack after the primary family. */
  fallback?: string;
};

/**
 * The typefaces the hero title cycles through. Add, remove, or reorder
 * entries here - everything else (loading, animation, timing) adapts.
 */
export const HERO_FONTS: HeroFont[] = [
  {
    family: "Playfair Display",
    weight: 800,
    category: "serif",
    letterSpacing: "-0.02em",
  },
  {
    family: "Bebas Neue",
    weight: 400,
    category: "display",
    letterSpacing: "0.015em",
  },
  // { family: "Archivo Black", weight: 400, category: "sans", letterSpacing: "-0.03em" },
  {
    family: "Space Mono",
    weight: 700,
    category: "mono",
    letterSpacing: "-0.04em",
  },
  { family: "Syne", weight: 400, category: "sans", letterSpacing: "-0.03em" },
  // { family: "Unbounded", weight: 700, category: "display", letterSpacing: "-0.04em" },
  {
    family: "DM Serif Display",
    weight: 400,
    category: "serif",
    letterSpacing: "-0.015em",
  },
  {
    family: "Instrument Serif",
    weight: 400,
    category: "serif",
    letterSpacing: "-0.01em",
  },
  {
    family: "Georgia",
    weight: 400,
    category: "serif",
    letterSpacing: "-0.02em",
  },
  {
    family: "Bricolage Grotesque",
    weight: 800,
    category: "sans",
    letterSpacing: "-0.035em",
  },
];

const FALLBACKS: Record<HeroFontCategory, string> = {
  serif: "Georgia, 'Times New Roman', serif",
  sans: "ui-sans-serif, system-ui, sans-serif",
  mono: "ui-monospace, 'SFMono-Regular', monospace",
  display: "ui-sans-serif, system-ui, sans-serif",
};

/** Full CSS `font-family` stack for a hero font. */
export const heroFontStack = (font: HeroFont) =>
  `"${font.family}", ${font.fallback ?? FALLBACKS[font.category]}`;

const googleSpecFor = (font: HeroFont) => {
  if (font.googleSpec === null) return null;
  if (font.googleSpec) return font.googleSpec;
  return `${font.family.replaceAll(" ", "+")}:wght@${font.weight}`;
};

let stylesheetInjected = false;

/**
 * Injects a single Google Fonts stylesheet covering every hero font.
 * Idempotent and safe to call on every mount.
 */
export const ensureHeroFontsLoaded = () => {
  if (stylesheetInjected || typeof document === "undefined") return;
  stylesheetInjected = true;

  const specs = HERO_FONTS.map(googleSpecFor).filter(
    (spec): spec is string => spec !== null,
  );
  if (specs.length === 0) return;

  const href = `https://fonts.googleapis.com/css2?${specs
    .map((spec) => `family=${spec}`)
    .join("&")}&display=swap`;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.dataset.heroFonts = "true";
  document.head.appendChild(link);
};
