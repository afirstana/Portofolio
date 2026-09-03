import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Abimael Firstana — Portfolio & Systems",
    short_name: "Abimael.Data",
    description: "Data systems, analytical clarity, and useful automation by Abimael Firstana.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#050506",
    theme_color: "#050506",
    categories: ["portfolio", "technology", "data-science", "analytics"],
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
    shortcuts: [
      {
        name: "Selected Work",
        short_name: "Work",
        description: "Explore data science, machine learning, and automation case studies",
        url: "/#work",
      },
      {
        name: "Certifications & Learning",
        short_name: "Credentials",
        description: "View verified industry certifications and learning tracks",
        url: "/learning/",
      },
      {
        name: "Essays & Opinions",
        short_name: "Opinions",
        description: "Technical writings and engineering viewpoints",
        url: "/opinion/",
      },
    ],
  };
}
