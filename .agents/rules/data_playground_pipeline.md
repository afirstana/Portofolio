# Rule: Real-World Dataset Ingestion for Analytical Showcases

1. **Analytical Integrity & Attribution**:
   - Always retain and display true metric definitions (e.g., crude death numbers vs. age-standardized rates per 100k).
   - Display data provenance footnotes with explicit dataset source attribution (e.g., IHME, OWID, World Bank).

2. **Static Export Optimization**:
   - Never load raw multi-megabyte CSV archives directly in browser runtime.
   - Use offline Python/Node data pipelines to filter, aggregate, and export structured JSON datasets sized under 150 kB for client-side interactivity.

3. **Multi-Dimensional Exploration**:
   - Support interactive dimensional slicing (by category, classification, time series, and demographic segments) with reversible sorting and responsive SVG visualizations.
