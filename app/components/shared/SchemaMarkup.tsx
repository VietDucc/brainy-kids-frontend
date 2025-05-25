import { siteConfig } from "@/app/metadata";

interface SchemaMarkupProps {
  type: "Organization" | "WebSite" | "Article" | "Course" | "Game";
  data?: Record<string, unknown>;
}

export const SchemaMarkup = ({ type }: SchemaMarkupProps) => {
  const baseSchema = {
    "@context": "https://schema.org",
  };

  const schemas = {
    Organization: {
      ...baseSchema,
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/logo.png`,
    },
    WebSite: {
      ...baseSchema,
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas[type]) }}
    />
  );
};
