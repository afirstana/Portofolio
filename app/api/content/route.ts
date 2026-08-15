import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const contentRoot = path.join(process.cwd(), "content");

export async function GET() {
  try {
    const hero = matter(fs.readFileSync(path.join(contentRoot, "hero.md"), "utf8")).data;
    const about = matter(fs.readFileSync(path.join(contentRoot, "about.md"), "utf8")).data;
    const skills = matter(fs.readFileSync(path.join(contentRoot, "skills.md"), "utf8")).data;
    const timeline = matter(fs.readFileSync(path.join(contentRoot, "timeline.md"), "utf8")).data;
    const contact = matter(fs.readFileSync(path.join(contentRoot, "contact.md"), "utf8")).data;
    const method = matter(fs.readFileSync(path.join(contentRoot, "method.md"), "utf8")).data;

    const projDir = path.join(contentRoot, "projects");
    const projectFiles = fs.readdirSync(projDir).filter((f) => f.endsWith(".md"));
    const projects = projectFiles.map((filename) => {
      const parsed = matter(fs.readFileSync(path.join(projDir, filename), "utf8"));
      return {
        _filename: filename,
        ...parsed.data,
        body: parsed.content.trim(),
      };
    });

    return NextResponse.json({
      success: true,
      data: { hero, about, skills, timeline, contact, method, projects },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, payload } = body;

    if (type === "project") {
      const { _filename, body: contentBody, ...frontmatter } = payload;
      const targetFilename = _filename || `${frontmatter.slug || "new-project"}.md`;
      const filePath = path.join(contentRoot, "projects", targetFilename);
      const fileContent = matter.stringify(contentBody || "", frontmatter);
      fs.writeFileSync(filePath, fileContent, "utf8");
      return NextResponse.json({ success: true, message: `Proyek ${targetFilename} berhasil disimpan!` });
    }

    if (type === "delete_project") {
      const { _filename } = payload;
      if (_filename) {
        const filePath = path.join(contentRoot, "projects", _filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return NextResponse.json({ success: true, message: `Proyek ${_filename} berhasil dihapus!` });
    }

    if (["hero", "about", "skills", "timeline", "contact", "method"].includes(type)) {
      const { body: contentBody, ...frontmatter } = payload;
      const filePath = path.join(contentRoot, `${type}.md`);
      const fileContent = matter.stringify(contentBody || "", frontmatter);
      fs.writeFileSync(filePath, fileContent, "utf8");
      return NextResponse.json({ success: true, message: `Bagian ${type} berhasil disimpan!` });
    }

    return NextResponse.json({ success: false, error: "Tipe konten tidak valid" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
