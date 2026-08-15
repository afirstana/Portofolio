import type { Metadata } from "next";
import "./globals.css";
import "./interactive.css";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: "Abimael.Data — Data systems", template: "%s | Abimael.Data" },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: siteConfig.locale, url: "/", siteName: siteConfig.name, title: "Abimael.Data — Data systems", description: siteConfig.description },
  twitter: { card: "summary", title: "Abimael.Data — Data systems", description: siteConfig.description },
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
