import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest { return { name: "Abimael.Data", short_name: "Abimael", description: "Data systems, analytical clarity, and useful automation.", start_url: "/", display: "standalone", background_color: "#050506", theme_color: "#050506", icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }] }; }
