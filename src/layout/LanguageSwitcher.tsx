import { Select } from "@mantine/core";
import { LOCALES, LOCALE_META, type Locale } from "../i18n/locales";
import { useLocale } from "../i18n/useLocale";

export const LanguageSwitcher = () => {
  const { locale, setLocale, t } = useLocale();

  return (
    <label className="language-switcher">
      <span className="visually-hidden">{t("nav.language")}</span>
      <Select
        size="xs"
        className="language-select"
        aria-label={t("nav.language")}
        allowDeselect={false}
        value={locale}
        data={LOCALES.map((code) => ({
          value: code,
          label: LOCALE_META[code].nativeName,
        }))}
        renderOption={({ option }) => (
          <span lang={LOCALE_META[option.value as Locale].htmlLang}>
            {option.label}
          </span>
        )}
        comboboxProps={{ width: "target", shadow: "md", withinPortal: true }}
        onChange={(value) => {
          if (value) setLocale(value as Locale);
        }}
      />
    </label>
  );
};
