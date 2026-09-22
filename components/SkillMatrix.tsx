import type { Project, SkillsContent } from "@/lib/content";

export function SkillMatrix({ content }: { content: SkillsContent; projects?: Project[] }) {
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
                    <div className="skill-item" key={skill.name}>
                      <span>{skill.name}</span>
                      <i>{String(skill.evidence.length).padStart(2, "0")}</i>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
