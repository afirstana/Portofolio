import { AdminStudio } from "@/components/admin/AdminStudio";
import { getAbout, getContact, getHero, getMethod, getProjects, getSkills, getTimeline } from "@/lib/content";

export const dynamic = "force-static";

export default function AdminPage() {
  const hero = getHero();
  const about = getAbout();
  const projects = getProjects().map((p) => ({ ...p, _filename: `${p.slug}.md` }));
  const skills = getSkills();
  const timeline = getTimeline();
  const contact = getContact();
  const method = getMethod();

  return (
    <AdminStudio
      initialData={{
        hero,
        about,
        projects,
        skills,
        timeline,
        contact,
        method,
      }}
    />
  );
}
