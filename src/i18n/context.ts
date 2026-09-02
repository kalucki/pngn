import { createContext } from "react";
import type { Locale } from "./locales";
import type { Translate } from "./messages";

export type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translate;
  dir: "ltr" | "rtl";
  htmlLang: string;
  translateError: (message: string) => string;
};

export const LocaleContext = createContext<LocaleContextValue | null>(null);
