export type Locale = "en" | "vi";

export type AllowedLocales = Locale[];

export type I18NConfig = {
  locales: readonly string[];
  defaultLocale: string;
  prefixDefault: boolean;
  localeDetection: boolean;
};