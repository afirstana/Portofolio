import type { ProjectEvidence } from "@/lib/content";

type VisualEvidenceProps = {
  projectSlug: string;
  evidence?: ProjectEvidence[];
};

export function VisualEvidence({ projectSlug, evidence }: VisualEvidenceProps) {
  const realEvidence = (evidence || []).filter((item) => Boolean(item.image && item.image.trim() !== ""));

  // If no real images exist, cleanly skip rendering the visual evidence section
  if (realEvidence.length === 0) {
    return null;
  }

  return (
    <section className="case-stage visual-evidence" id="evidence" aria-labelledby="evidence-heading">
      <div className="evidence-heading">
        <div>
          <p className="mono case-label">Visual evidence</p>
          <h2 id="evidence-heading">Production Visuals & System Artifacts.</h2>
        </div>
        <p>
          Verified production captures and technical architecture artifacts for <code>{projectSlug}</code>.
        </p>
      </div>

      <div className="evidence-grid">
        {realEvidence.map((item) => (
          <figure className="evidence-card" key={item.slot}>
            <img src={item.image} alt={item.alt} loading="lazy" />
            <figcaption>
              <span className="mono">{item.kind}</span>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
