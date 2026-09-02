export const LOCALES = ["en", "es", "pl", "zh", "pcm", "ar"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_STORAGE_KEY = "txtimg-locale";

export const LOCALE_META: Record<
  Locale,
  { nativeName: string; dir: "ltr" | "rtl"; htmlLang: string }
> = {
  en: { nativeName: "English", dir: "ltr", htmlLang: "en" },
  es: { nativeName: "Español", dir: "ltr", htmlLang: "es" },
  pl: { nativeName: "Polski", dir: "ltr", htmlLang: "pl" },
  zh: { nativeName: "中文", dir: "ltr", htmlLang: "zh-Hans" },
  pcm: { nativeName: "Nigerian", dir: "ltr", htmlLang: "pcm" },
  ar: { nativeName: "العربية", dir: "rtl", htmlLang: "ar" },
};

export const isLocale = (value: string | null | undefined): value is Locale =>
  LOCALES.includes(value as Locale);
