import os
import glob
import pandas as pd

def check_files():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    cancer_dir = os.path.join(base_dir, "..", "dataset", "Work", "4. Cancer", "archive-cancer dataset")
    files = glob.glob(os.path.join(cancer_dir, "*.csv"))
    print(f"Found {len(files)} CSV files in {cancer_dir}")
    for f in sorted(files):
        df = pd.read_csv(f, nrows=2)
        print(f"File: {os.path.basename(f)} | Shape: {df.shape} | Columns: {list(df.columns)}")

if __name__ == "__main__":
    check_files()
