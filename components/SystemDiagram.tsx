import type { ProjectSystem } from "@/lib/content";

export function SystemDiagram({ nodes }: { nodes: ProjectSystem[] }) {
  if (!nodes || nodes.length === 0) return null;
  return (
    <div className="system-diagram" role="img" aria-label="System flow diagram">
      {nodes.map((node, index) => {
        const label = node.label || (node as any).name || `0${index + 1}. Stage`;
        const value = node.value || (node as any).detail || "";
        return (
          <div className="system-node" key={label || `node-${index}`}>
            <span className="mono">0{index + 1}</span>
            <strong>{label}</strong>
            <p>{value}</p>
            {index < nodes.length - 1 && <i aria-hidden="true">→</i>}
          </div>
        );
      })}
    </div>
  );
}
