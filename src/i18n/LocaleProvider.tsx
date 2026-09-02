import { useEffect, useMemo, useState, type ReactNode } from "react";
import { LocaleContext } from "./context";
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_META,
  LOCALE_STORAGE_KEY,
  type Locale,
} from "./locales";
import { translate, translateError, type Translate } from "./messages";

const readStoredLocale = (): Locale => {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // Ignore missing storage (private mode, SSR).
  }
  return DEFAULT_LOCALE;
};

const applyDocumentLocale = (locale: Locale) => {
  const meta = LOCALE_META[locale];
  document.documentElement.lang = meta.htmlLang;
  document.documentElement.dir = meta.dir;
};

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const next = readStoredLocale();
    applyDocumentLocale(next);
    return next;
  });

  useEffect(() => {
    applyDocumentLocale(locale);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // Ignore quota / privacy errors.
    }
  }, [locale]);

  const value = useMemo(() => {
    const t: Translate = (key, vars) => translate(locale, key, vars);
    return {
      locale,
      setLocale: setLocaleState,
      t,
      dir: LOCALE_META[locale].dir,
      htmlLang: LOCALE_META[locale].htmlLang,
      translateError: (message: string) => translateError(locale, message),
    };
  }, [locale]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};
