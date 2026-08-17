import type { Metadata } from "next";
import "./globals.css";
import "./interactive.css";
import { siteConfig } from "@/lib/site";
import { FloatingBackToTop } from "@/components/GlobalUX";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: "Abimael.Data — Data systems", template: "%s | Abimael.Data" },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: siteConfig.locale, url: "/", siteName: siteConfig.name, title: "Abimael.Data — Data systems", description: siteConfig.description },
  twitter: { card: "summary", title: "Abimael.Data — Data systems", description: siteConfig.description },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);document.body&&document.body.setAttribute("data-theme",t);}else{document.documentElement.setAttribute("data-theme","dark");document.body&&document.body.setAttribute("data-theme","dark");}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        {children}
        <FloatingBackToTop />
      </body>
    </html>
  );
}
