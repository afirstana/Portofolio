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
          {/* Left Column: Skill Groups */}
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

          {/* Right Column: Compact High-Density Evidence Card */}
          <aside className="skill-evidence-card" aria-live="polite">
            <div className="skill-evidence-topbar mono">
              <div className="evidence-pill-label">
                <span className="pulse-dot" aria-hidden="true" />
                <span>EVIDENCE / {chosen?.name ?? "—"}</span>
              </div>
              <span className="evidence-badge-tag">
                {String(evidence.length).padStart(2, "0")} SYSTEMS
              </span>
            </div>

            {evidence.length > 0 ? (
              <div className="skill-evidence-scrollpane">
                {evidence.map((project, idx) => (
                  <Link
                    href={`/projects/${project.slug}/`}
                    key={project.slug}
                    className="skill-evidence-row"
                  >
                    <div className="evidence-row-left">
                      <span className="mono evidence-row-num">{String(idx + 1).padStart(2, "0")}.</span>
                      <div className="evidence-row-texts">
                        <strong className="evidence-row-title">{project.title}</strong>
                        <span className="mono evidence-row-category">{project.category}</span>
                      </div>
                    </div>
                    <span className="evidence-row-arrow" aria-hidden="true">↗</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="skill-evidence-empty mono">
                <p>// Evidence is being documented through production systems.</p>
              </div>
            )}

            <div className="skill-evidence-foot mono">
              <span>Click to open technical case study ↗</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
