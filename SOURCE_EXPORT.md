# Source export guarantee

The project source is intentionally kept at the repository root and is **not** excluded by `.gitignore`. Every `pnpm build` additionally creates `out/source/`, a complete editable copy of the application, its Markdown content, components, library code, scripts, and build configuration.

When downloading a static-export artifact, open `source/` inside it to edit the Markdown files in `source/content/`. To rebuild the site, run `pnpm install && pnpm build` from that source folder.
