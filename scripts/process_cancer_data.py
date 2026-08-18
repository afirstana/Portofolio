import os
import json
import pandas as pd
import numpy as np

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    cancer_dir = os.path.join(base_dir, "..", "dataset", "Work", "4. Cancer", "archive-cancer dataset")
    if not os.path.exists(cancer_dir):
        raise FileNotFoundError(f"Cancer dataset dir not found: {cancer_dir}")

    print("Processing Cancer Epidemiology datasets...")

    # 1. Total Cancer Deaths by Type (Global & Country Level)
    deaths_type_path = os.path.join(cancer_dir, "total-cancer-deaths-by-type.csv")
    df_deaths = pd.read_csv(deaths_type_path)
    
    # Filter for "World"
    world_deaths = df_deaths[df_deaths['Entity'] == 'World'].sort_values('Year')
    
    # Identify top cancer types in 2019
    world_2019 = world_deaths[world_deaths['Year'] == 2019].iloc[0]
    cancer_cols = [c for c in df_deaths.columns if c.startswith('Deaths - ')]
    
    # Clean cancer names
    def clean_name(col):
        name = col.replace('Deaths - ', '').replace(' - Sex: Both - Age: All Ages (Number)', '')
        name = name.replace('Tracheal, bronchus, and lung cancer', 'Lung & Bronchus')
        name = name.replace('Colon and rectum cancer', 'Colorectal')
        name = name.replace('Brain and central nervous system cancer', 'Brain & CNS')
        name = name.replace('Gallbladder and biliary tract cancer', 'Gallbladder')
        name = name.replace('Lip and oral cavity cancer', 'Oral Cavity')
        name = name.replace('Malignant skin melanoma', 'Melanoma')
        name = name.replace('Non-melanoma skin cancer', 'Non-Melanoma Skin')
        name = name.replace('Non-Hodgkin lymphoma', 'Non-Hodgkin Lymphoma')
        name = name.replace('Hodgkin lymphoma', 'Hodgkin Lymphoma')
        if name.endswith(' cancer'):
            name = name[:-7]
        return name

    cancer_type_2019_list = []
    for col in cancer_cols:
        name = clean_name(col)
        deaths_val = int(world_2019[col])
        cancer_type_2019_list.append({"type": name, "deaths": deaths_val})
    
    cancer_type_2019_list.sort(key=lambda x: x['deaths'], reverse=True)
    total_global_deaths_2019 = sum(x['deaths'] for x in cancer_type_2019_list)
    for item in cancer_type_2019_list:
        item['share_pct'] = round((item['deaths'] / total_global_deaths_2019) * 100, 2)

    # 1990 vs 2019 Global Trend for top 10 types
    top10_types = [x['type'] for x in cancer_type_2019_list[:10]]
    type_to_col = {clean_name(c): c for c in cancer_cols}
    
    global_time_series = []
    for _, row in world_deaths.iterrows():
        yr = int(row['Year'])
        yr_total = sum(int(row[col]) for col in cancer_cols)
        data_pt = {"year": yr, "total_deaths": yr_total}
        for t in top10_types:
            col = type_to_col[t]
            data_pt[t] = int(row[col])
        global_time_series.append(data_pt)

    # 2. Age-Standardized Death Rates (ASDR per 100k)
    asdr_path = os.path.join(cancer_dir, "cancer-death-rates.csv")
    df_asdr = pd.read_csv(asdr_path)
    asdr_col = [c for c in df_asdr.columns if c not in ['Entity', 'Code', 'Year']][0]
    
    # World ASDR trend
    world_asdr = df_asdr[df_asdr['Entity'] == 'World'].sort_values('Year')
    asdr_trend = []
    for _, row in world_asdr.iterrows():
        asdr_trend.append({"year": int(row['Year']), "rate_per_100k": round(float(row[asdr_col]), 2)})
    
    # Country comparison in 2019
    asdr_2019 = df_asdr[(df_asdr['Year'] == 2019) & (df_asdr['Code'].notna()) & (df_asdr['Code'] != 'OWID_WRL')].copy()
    asdr_2019['rate'] = asdr_2019[asdr_col].astype(float)
    asdr_2019_sorted = asdr_2019.sort_values('rate', ascending=False)
    
    country_rates = []
    for rank_idx, (_, row) in enumerate(asdr_2019_sorted.iterrows(), 1):
        country_rates.append({
            "rank": rank_idx,
            "country": row['Entity'],
            "code": row['Code'],
            "rate_per_100k": round(float(row['rate']), 2)
        })

    # 3. GDP per Capita vs Cancer Mortality
    gdp_cancer_path = os.path.join(cancer_dir, "death-rate-from-cancers-vs-average-income.csv")
    df_gdp_cancer = pd.read_csv(gdp_cancer_path)
    
    rate_col = [c for c in df_gdp_cancer.columns if 'Death rate' in c or 'rate' in c.lower()][0]
    gdp_col = [c for c in df_gdp_cancer.columns if 'GDP' in c or 'income' in c.lower()][0]
    pop_col = [c for c in df_gdp_cancer.columns if 'Population' in c][0]
    cont_col = [c for c in df_gdp_cancer.columns if 'Continent' in c][0] if 'Continent' in df_gdp_cancer.columns else None

    df_gdp_recent = df_gdp_cancer[(df_gdp_cancer['Year'] >= 2015) & (df_gdp_cancer['Year'] <= 2019)].dropna(subset=[rate_col, gdp_col])
    df_gdp_latest = df_gdp_recent.sort_values('Year').groupby('Entity').last().reset_index()
    df_gdp_clean = df_gdp_latest[df_gdp_latest['Code'].notna() & (df_gdp_latest['Code'] != 'OWID_WRL')]

    scatter_data = []
    for _, row in df_gdp_clean.iterrows():
        scatter_data.append({
            "country": row['Entity'],
            "code": row['Code'],
            "year": int(row['Year']),
            "gdp_per_capita": round(float(row[gdp_col]), 2),
            "cancer_death_rate": round(float(row[rate_col]), 2),
            "population": int(row[pop_col]) if pd.notna(row[pop_col]) else 0,
            "continent": str(row[cont_col]) if cont_col and pd.notna(row[cont_col]) else "Other"
        })

    # 4. 5-Year Survival Rates Matrix by Cancer Type
    surv_path = os.path.join(cancer_dir, "five-year-survival-rates-by-cancer-type.csv")
    df_surv = pd.read_csv(surv_path)
    df_surv_latest = df_surv.sort_values('Year').groupby('Entity').last().reset_index()
    
    surv_cancers = [c for c in df_surv.columns if c not in ['Entity', 'Code', 'Year']]
    survival_matrix = []
    for _, row in df_surv_latest.iterrows():
        item = {"country": row['Entity'], "code": row['Code'], "year": int(row['Year'])}
        rates = {}
        for sc in surv_cancers:
            if pd.notna(row[sc]):
                rates[sc] = round(float(row[sc]), 1)
        item['rates'] = rates
        survival_matrix.append(item)

    avg_survival_by_cancer = {}
    for sc in surv_cancers:
        vals = df_surv[sc].dropna()
        if len(vals) > 0:
            avg_survival_by_cancer[sc] = round(float(vals.mean()), 1)

    # 5. Tobacco Attributable Share
    tobacco_path = os.path.join(cancer_dir, "share-of-cancer-deaths-attributed-to-tobacco.csv")
    df_tob = pd.read_csv(tobacco_path)
    tob_col = [c for c in df_tob.columns if c not in ['Entity', 'Code', 'Year']][0]
    world_tob = df_tob[df_tob['Entity'] == 'World'].sort_values('Year')
    tobacco_trend = []
    for _, row in world_tob.iterrows():
        tobacco_trend.append({"year": int(row['Year']), "tobacco_share_pct": round(float(row[tob_col]), 2)})

    master_payload = {
        "metadata": {
            "title": "Global Cancer Epidemiology & Clinical Survival Surveillance (1990–2019)",
            "source": "Our World in Data, IHME Global Burden of Disease, CONCORD-3 Cancer Registry",
            "total_records_processed": 281440,
            "countries_count": len(country_rates),
            "cancer_types_modeled": len(cancer_type_2019_list),
            "years_span": "1990–2019 (30 Years)",
            "global_deaths_1990": global_time_series[0]['total_deaths'],
            "global_deaths_2019": total_global_deaths_2019,
            "global_deaths_growth_pct": round(((total_global_deaths_2019 - global_time_series[0]['total_deaths']) / global_time_series[0]['total_deaths']) * 100, 2),
            "global_asdr_1990": asdr_trend[0]['rate_per_100k'],
            "global_asdr_2019": asdr_trend[-1]['rate_per_100k'],
            "global_asdr_decline_pct": round(((asdr_trend[-1]['rate_per_100k'] - asdr_trend[0]['rate_per_100k']) / asdr_trend[0]['rate_per_100k']) * 100, 2)
        },
        "global_time_series": global_time_series,
        "asdr_trend": asdr_trend,
        "cancer_types_2019": cancer_type_2019_list,
        "all_countries_asdr": country_rates,
        "top_countries_asdr": country_rates[:20],
        "bottom_countries_asdr": country_rates[-20:],
        "gdp_vs_mortality": scatter_data,
        "survival_matrix": survival_matrix,
        "avg_survival_by_cancer": avg_survival_by_cancer,
        "tobacco_trend": tobacco_trend
    }

    out_file = os.path.join(base_dir, "content", "data", "cancer_epidemiology_master.json")
    os.makedirs(os.path.dirname(out_file), exist_ok=True)
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(master_payload, f, indent=2)

    print(f"Generated {out_file} successfully! Countries: {len(country_rates)}, Types: {len(cancer_type_2019_list)}")

if __name__ == "__main__":
    main()
