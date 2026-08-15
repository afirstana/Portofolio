# Local static data artifacts

`amazon-dashboard.json` is a cleaned, aggregated artifact generated from the user-supplied Amazon CSV. It powers filters, charts, category statistics, and review-term summaries in the browser.

`amazon-model.json` contains evaluation metrics plus a compact export of the trained TF-IDF Logistic Regression text model used by the local prediction demonstration. Rebuild both files using `analysis/amazon/analyze_amazon.py`; see `analysis/amazon/README.md` for the full workflow and limitations.
