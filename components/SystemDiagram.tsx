import type { ProjectSystem } from "@/lib/content";

export function SystemDiagram({ nodes }: { nodes: ProjectSystem[] }) {
  return <div className="system-diagram" role="img" aria-label="System flow diagram">{nodes.map((node, index) => <div className="system-node" key={node.label}><span className="mono">0{index + 1}</span><strong>{node.label}</strong><p>{node.value}</p>{index < nodes.length - 1 && <i aria-hidden="true">→</i>}</div>)}</div>;
}
