import { I18NConfig } from "../types";

export const defaultLocale = "vi";
export const locales = ["en", "vi"] as const;
export type Locale = (typeof locales)[number];

export const i18nConfig: I18NConfig = {
  locales: locales,
  defaultLocale,
  prefixDefault: true,
  localeDetection: true,
};