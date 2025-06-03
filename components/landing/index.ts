import { I18nProps } from "@/lib/types/i18n";

export { default as Header } from "./header";
export { default as Hero } from "./hero";
export { default as Feature } from "./feature";
export { default as WorkFlow } from "./workflow";
export { default as Feedback } from "./feedback";
export { default as Stat } from "./stat";
export { default as Price } from "./price";
export { default as CTA } from "./cta";
export { default as Footer } from "./footer";

// Re-export types
export type { I18nProps };

// Export component types with proper i18n props
export type HeaderProps = I18nProps;
export type HeroProps = I18nProps;
export type FeatureProps = I18nProps;
export type WorkFlowProps = I18nProps;
export type FeedbackProps = I18nProps;
export type StatProps = I18nProps;
export type PriceProps = I18nProps;
export type CTAProps = I18nProps;
export type FooterProps = I18nProps; 