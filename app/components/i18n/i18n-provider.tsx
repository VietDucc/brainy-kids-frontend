"use client";

import { I18nextProvider } from "react-i18next";
import { createInstance } from "i18next";
import { serverSideTranslation } from "@/lib/i18n/client";

type Props = {
  children: React.ReactNode;
  locale: string;
  namespaces: string[];
  resources: any;
};

export default function I18NProvider({
  children,
  locale,
  namespaces,
  resources,
}: Props) {
  const i18n = createInstance();

  // Initialize client-side i18n instance with resources provided by the server
  serverSideTranslation(locale, namespaces, { i18nInstance: i18n, resources });

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
