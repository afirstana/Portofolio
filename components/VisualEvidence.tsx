import type { ProjectEvidence } from "@/lib/content";

type VisualEvidenceProps = {
  projectSlug: string;
  evidence: ProjectEvidence[];
};

export function VisualEvidence({ projectSlug, evidence }: VisualEvidenceProps) {
  return (
    <section className="case-stage visual-evidence" id="evidence" aria-labelledby="evidence-heading">
      <div className="evidence-heading">
        <div>
          <p className="mono case-label">Visual evidence</p>
          <h2 id="evidence-heading">Screenshots ready to add.</h2>
        </div>
        <p>
          Replace each placeholder with a local asset in <code>public/evidence/{projectSlug}/</code>, then set its
          <code> image</code> value in this project&apos;s Markdown frontmatter.
        </p>
      </div>

      {evidence.length === 0 ? (
        <div className="empty-state evidence-empty" role="status">
          <p>No visual evidence slots are configured for this case study yet.</p>
          <p>Add metadata in the project Markdown, then place screenshots in <code>public/evidence/{projectSlug}/</code>.</p>
        </div>
      ) : (
        <div className="evidence-grid">
          {evidence.map((item) => {
          const suggestedPath = `/evidence/${projectSlug}/${item.slot}.webp`;
          return (
            <figure className="evidence-card" key={item.slot}>
              {item.image ? (
                <img src={item.image} alt={item.alt} loading="lazy" />
              ) : (
                <div className="evidence-placeholder" role="img" aria-label={item.alt}>
                  <span className="mono">SLOT {item.slot} / {item.kind}</span>
                  <strong>{item.title}</strong>
                  <i aria-hidden="true">↗</i>
                  <p>Drop a redacted screenshot or diagram here.</p>
                  <code>{suggestedPath}</code>
                </div>
              )}
              <figcaption>
                <span className="mono">{item.kind}</span>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </figcaption>
            </figure>
          );
          })}
        </div>
      )}
    </section>
  );
}
