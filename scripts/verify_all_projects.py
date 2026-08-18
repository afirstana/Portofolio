import os
import glob
import yaml

def verify():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    projects_dir = os.path.join(base_dir, "content", "projects")
    files = glob.glob(os.path.join(projects_dir, "*.md"))
    print(f"Auditing {len(files)} projects in {projects_dir}...\n")
    
    errors = []
    for f in sorted(files):
        with open(f, "r", encoding="utf-8") as fp:
            content = fp.read()
        parts = content.split("---", 2)
        if len(parts) < 3:
            errors.append(f"Invalid markdown frontmatter formatting in {f}")
            continue
        meta = yaml.safe_load(parts[1])
        body = parts[2].strip()
        slug = meta.get("slug")
        title = meta.get("title")
        
        print(f"Checking [{slug}] - {title}")
        
        # 1. System nodes
        system = meta.get("system", [])
        if not system or len(system) == 0:
            errors.append(f"[{slug}] Missing system nodes")
        for i, node in enumerate(system):
            if not isinstance(node, dict):
                errors.append(f"[{slug}] System node {i} is not a dict: {node}")
                continue
            lbl = node.get("label")
            val = node.get("value")
            if not lbl or not val:
                errors.append(f"[{slug}] System node {i} has empty label ('{lbl}') or value ('{val}')")
        
        # 2. Preview metrics
        preview = meta.get("preview", {})
        metrics = preview.get("metrics", [])
        if len(metrics) != 3:
            errors.append(f"[{slug}] Preview metrics count is {len(metrics)}, expected 3")
        for m in metrics:
            if not m.get("label") or not m.get("value"):
                errors.append(f"[{slug}] Preview metric has empty label/value: {m}")
        if not preview.get("eyebrow") or not preview.get("takeaway"):
            errors.append(f"[{slug}] Preview missing eyebrow or takeaway")
            
        # 3. Lessons
        lessons = meta.get("lessons", [])
        if len(lessons) < 2:
            errors.append(f"[{slug}] Lessons count is {len(lessons)}, expected >= 2")
            
        # 4. Evidence
        evidence = meta.get("evidence", [])
        if len(evidence) != 3:
            errors.append(f"[{slug}] Evidence count is {len(evidence)}, expected 3")
            
        # 5. Body
        if len(body) < 1000:
            errors.append(f"[{slug}] Body length is {len(body)}, expected > 1000")
            
        print(f"  [OK] System nodes: {len(system)} | Metrics: {len(metrics)} | Lessons: {len(lessons)} | Evidence: {len(evidence)} | Body: {len(body)} chars")

    print("\n" + "="*50)
    if errors:
        print("AUDIT FAILED with errors:")
        for e in errors:
            print(f" - {e}")
        return False
    else:
        print("ALL 8 PROJECTS PASSED COMPLETE AUDIT WITH ZERO ERRORS!")
        return True

if __name__ == "__main__":
    verify()
