import type { ProjectSystem } from "@/lib/content";

export function SystemDiagram({ nodes }: { nodes: ProjectSystem[] }) {
  if (!nodes || nodes.length === 0) return null;
  return (
    <div className="system-diagram" role="img" aria-label="System architecture flow">
      {nodes.map((node, index) => {
        const label = node.label || (node as any).title || (node as any).name || `Phase 0${index + 1}`;
        const value = node.value || (node as any).role || (node as any).detail || (node as any).description || "";
        return (
          <div className="system-node" key={label || `node-${index}`}>
            <span className="mono">0{index + 1}</span>
            <strong>{label}</strong>
            {value && <p>{value}</p>}
            {index < nodes.length - 1 && <i aria-hidden="true">→</i>}
          </div>
        );
      })}
    </div>
  );
}
