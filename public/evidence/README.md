# Local case-study evidence

This folder is intentionally local and is copied into the static export. It does not use a database, media service, S3, or an external API.

For each project, create a subfolder such as `public/evidence/ml-product-mapping-system/` and save a redacted screenshot or diagram using the slot filename shown on the case-study page, for example `01.webp`.

Then update the matching `image` property in `content/projects/<project-slug>.md` to the public URL:

```yaml
image: "/evidence/ml-product-mapping-system/01.webp"
```

Keep the provided `alt`, `title`, and `description` fields accurate. When `image` is blank, the site intentionally renders an accessible visual placeholder instead.
