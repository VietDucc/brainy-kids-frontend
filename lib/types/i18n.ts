import { TFunction } from "i18next";

export interface I18nProps {
  t: TFunction;
}

export type Locale = "en" | "vi";

// Add namespace types
export type AllNamespaces = "common" | "hero" | "feature";

// Add translation schema types
export interface TranslationSchema {
  common: typeof import("@/lib/i18n/translations/en/common.json");
  hero: typeof import("@/lib/i18n/translations/en/hero.json");
  feature: typeof import("@/lib/i18n/translations/en/feature.json");
} 