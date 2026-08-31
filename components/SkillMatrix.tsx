"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Project, SkillsContent } from "@/lib/content";

export function SkillMatrix({ content, projects }: { content: SkillsContent; projects: Project[] }) {
  const initial = content.groups[0]?.skills[0]?.name ?? "";
  const [selected, setSelected] = useState(initial);
  const chosen = useMemo(
    () => content.groups.flatMap((group) => group.skills).find((skill) => skill.name === selected),
    [content.groups, selected]
  );
  const evidence = projects.filter((project) => chosen?.evidence.includes(project.slug));

  return (
    <section id="skills" className="section skills-section" aria-labelledby="skills-title">
      <div className="page-width">
        <p className="section-label mono">{content.eyebrow}</p>
        <h2 id="skills-title" className="section-title narrow-title">
          {content.heading}
        </h2>
        <div className="skill-layout">
          <div className="skill-groups">
            {content.groups.map((group) => (
              <div className="skill-group" key={group.name}>
                <p className="mono">{group.name}</p>
                <div className="skill-items">
                  {group.skills.map((skill) => (
                    <button
                      type="button"
                      onClick={() => setSelected(skill.name)}
                      aria-pressed={selected === skill.name}
                      key={skill.name}
                    >
                      <span>{skill.name}</span>
                      <i>{String(skill.evidence.length).padStart(2, "0")}</i>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <aside className="skill-evidence" aria-live="polite">
            <div className="skill-evidence-header mono">
              <p>Evidence / {chosen?.name ?? "—"}</p>
              <span className="evidence-count-tag">
                {String(evidence.length).padStart(2, "0")} Systems
              </span>
            </div>

            {evidence.length > 0 ? (
              <div className="skill-evidence-list">
                {evidence.map((project, idx) => (
                  <Link href={`/projects/${project.slug}/`} key={project.slug} className="skill-evidence-item">
                    <span className="mono evidence-item-idx">{String(idx + 1).padStart(2, "0")}.</span>
                    <span className="evidence-item-title">{project.title}</span>
                    <i className="evidence-item-arrow" aria-hidden="true">↗</i>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="skill-evidence-empty mono">Evidence is being documented through the work itself.</p>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
