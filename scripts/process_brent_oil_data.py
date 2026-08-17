import os
import json
import pandas as pd
import numpy as np

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    # Source dataset path
    csv_path = os.path.join(base_dir, "..", "dataset", "Work", "3. Brent Oil Prices", "data", "BrentOilPrices.csv")
    if not os.path.exists(csv_path):
        # Fallback to local data dir if exists
        alt_path = os.path.join(base_dir, "content", "data", "BrentOilPrices.csv")
        if os.path.exists(alt_path):
            csv_path = alt_path
        else:
            raise FileNotFoundError(f"Source file not found at: {csv_path}")

    print(f"Reading {csv_path}...")
    df = pd.read_csv(csv_path)

    # Multi-format date parsing
    def parse_date(d):
        for fmt in ('%d-%b-%y', '%b %d, %Y'):
            try:
                return pd.to_datetime(d, format=fmt)
            except ValueError:
                continue
        return pd.to_datetime(d)

    df['Date'] = df['Date'].apply(parse_date)
    df = df.sort_values('Date').reset_index(drop=True)

    df['Year'] = df['Date'].dt.year
    df['Month'] = df['Date'].dt.month
    df['DateStr'] = df['Date'].dt.strftime('%Y-%m-%d')
    df['Decade'] = (df['Year'] // 10) * 10
    df['DecadeLabel'] = df['Decade'].apply(lambda d: f"{d}s" if d != 1980 else "1987-1999")
    
    # Calculate daily returns
    df['Daily_Return_Pct'] = df['Price'].pct_change() * 100
    df['MA_30'] = df['Price'].rolling(30, min_periods=1).mean()
    df['MA_90'] = df['Price'].rolling(90, min_periods=1).mean()
    df['MA_365'] = df['Price'].rolling(365, min_periods=1).mean()
    df['Rolling_Std_30'] = df['Daily_Return_Pct'].rolling(30, min_periods=1).std()

    # Overall Summary
    total_records = len(df)
    min_price = float(df['Price'].min())
    max_price = float(df['Price'].max())
    mean_price = float(df['Price'].mean())
    median_price = float(df['Price'].median())
    std_price = float(df['Price'].std())

    min_row = df.loc[df['Price'].idxmin()]
    max_row = df.loc[df['Price'].idxmax()]

    # Returns stats
    returns_clean = df['Daily_Return_Pct'].dropna()
    mean_ret = float(returns_clean.mean())
    std_ret = float(returns_clean.std())
    skew_ret = float(returns_clean.skew())
    kurt_ret = float(returns_clean.kurt())
    var_95 = float(returns_clean.quantile(0.05))
    var_99 = float(returns_clean.quantile(0.01))

    # Anomaly detection (|Z| > 3)
    df['Z_Score'] = (df['Daily_Return_Pct'] - mean_ret) / std_ret
    anomalies = df[df['Z_Score'].abs() > 3]

    # Decade breakdown
    decades_data = []
    decade_ranges = [
        (1987, 1999, "1987–1999", "Low & Stable Pre-Globalized Era"),
        (2000, 2009, "2000–2009", "Commodity Supercycle & Peak ($143.95)"),
        (2010, 2019, "2010–2019", "US Shale Oil Boom & 2014-16 Price Collapse"),
        (2020, 2022, "2020–2022", "COVID Crash ($9.10) & Russia-Ukraine Rebound")
    ]

    for start_yr, end_yr, dec_label, context in decade_ranges:
        dec_df = df[(df['Year'] >= start_yr) & (df['Year'] <= end_yr)]
        if len(dec_df) > 0:
            decades_data.append({
                "period": dec_label,
                "context": context,
                "count": int(len(dec_df)),
                "mean": round(float(dec_df['Price'].mean()), 2),
                "median": round(float(dec_df['Price'].median()), 2),
                "min": round(float(dec_df['Price'].min()), 2),
                "max": round(float(dec_df['Price'].max()), 2),
                "std": round(float(dec_df['Price'].std()), 2),
                "volatility_pct": round(float(dec_df['Daily_Return_Pct'].std()), 2)
            })

    # Yearly summary
    yearly_data = []
    for year, ydf in df.groupby('Year'):
        yearly_data.append({
            "year": int(year),
            "avg_price": round(float(ydf['Price'].mean()), 2),
            "min_price": round(float(ydf['Price'].min()), 2),
            "max_price": round(float(ydf['Price'].max()), 2),
            "count": int(len(ydf)),
            "volatility": round(float(ydf['Daily_Return_Pct'].std()), 2)
        })

    # 7 Major Historical Crises & Before/During/After Impact
    def calc_event_impact(event_date_str, name, window_days, description, tag):
        event_dt = pd.to_datetime(event_date_str)
        before_mask = (df['Date'] >= event_dt - pd.Timedelta(days=window_days)) & (df['Date'] < event_dt)
        after_mask = (df['Date'] > event_dt) & (df['Date'] <= event_dt + pd.Timedelta(days=window_days))
        
        before_df = df[before_mask]
        after_df = df[after_mask]
        
        price_before = float(before_df['Price'].mean()) if len(before_df) > 0 else float(df[df['Date'] == event_dt]['Price'].values[0])
        price_after = float(after_df['Price'].mean()) if len(after_df) > 0 else float(df[df['Date'] == event_dt]['Price'].values[0])
        pct_change = ((price_after - price_before) / price_before) * 100 if price_before > 0 else 0.0

        # Exact price on or near event date
        exact_row = df[df['Date'] >= event_dt].head(1)
        event_price = float(exact_row['Price'].values[0]) if len(exact_row) > 0 else price_before

        return {
            "date": event_date_str,
            "name": name,
            "tag": tag,
            "description": description,
            "window_days": window_days,
            "event_price": round(event_price, 2),
            "avg_before": round(price_before, 2),
            "avg_after": round(price_after, 2),
            "pct_impact": round(pct_change, 2)
        }

    crises = [
        calc_event_impact("1990-08-02", "Gulf War (Kuwait Invasion)", 30, "Iraqi invasion of Kuwait triggered immediate oil supply shock and regional geopolitical tension.", "Supply Shock"),
        calc_event_impact("1997-10-01", "Asian Financial Crisis", 60, "Severe economic contraction across East Asian tiger economies suppressed global energy demand.", "Demand Shock"),
        calc_event_impact("2008-07-03", "Commodity Supercycle All-Time High ($143.95)", 30, "All-time peak driven by rapid Chinese/Indian industrialization right before the Global Financial Crisis collapse.", "Price Spike"),
        calc_event_impact("2014-06-20", "US Shale Boom & OPEC Market Share War", 90, "Unprecedented US horizontal fracking oversupply combined with OPEC refusal to cut production slashed prices by >70%.", "Structural Oversupply"),
        calc_event_impact("2020-03-11", "COVID-19 Pandemic Declaration & Price War", 30, "Global transport lockdowns destroyed 30% of worldwide oil demand, compounded by Saudi-Russia production disputes.", "Demand Collapse"),
        calc_event_impact("2020-04-21", "COVID Market Nadir ($9.10)", 15, "Historic physical storage exhaustion and futures dislocation marked the absolute 35-year low at $9.10/bbl.", "All-Time Low"),
        calc_event_impact("2022-02-24", "Russia-Ukraine War Invasion", 30, "Russian military operations sparked severe Western sanctions and European energy supply deficit, surging price to $133.18.", "Geopolitical Spike")
    ]

    # Sample monthly points for lightweight SVG interactive charting (resampled to monthly for smooth UI payload)
    monthly_series = []
    for (year, month), mdf in df.groupby(['Year', 'Month']):
        first_row = mdf.iloc[-1]
        monthly_series.append({
            "date": f"{year}-{month:02d}",
            "price": round(float(mdf['Price'].mean()), 2),
            "ma_30": round(float(mdf['MA_30'].mean()), 2),
            "ma_365": round(float(mdf['MA_365'].mean()), 2),
            "min": round(float(mdf['Price'].min()), 2),
            "max": round(float(mdf['Price'].max()), 2),
            "volatility": round(float(mdf['Rolling_Std_30'].mean()), 2)
        })

    output_payload = {
        "metadata": {
            "title": "Brent Crude Oil Prices 35.5-Year Econometric Dataset",
            "start_date": "1987-05-20",
            "end_date": "2022-11-14",
            "total_trading_days": total_records,
            "min_price": min_price,
            "min_date": min_row['DateStr'],
            "max_price": max_price,
            "max_date": max_row['DateStr'],
            "mean_price": round(mean_price, 2),
            "median_price": round(median_price, 2),
            "std_price": round(std_price, 2)
        },
        "risk_statistics": {
            "daily_mean_return_pct": round(mean_ret, 3),
            "daily_std_return_pct": round(std_ret, 3),
            "skewness": round(skew_ret, 3),
            "kurtosis": round(kurt_ret, 3),
            "var_95_daily_pct": round(var_95, 2),
            "var_99_daily_pct": round(var_99, 2),
            "anomaly_days_count": int(len(anomalies))
        },
        "decades": decades_data,
        "yearly_summary": yearly_data,
        "historical_crises": crises,
        "monthly_series": monthly_series
    }

    out_file = os.path.join(base_dir, "content", "data", "brent_oil_analysis.json")
    os.makedirs(os.path.dirname(out_file), exist_ok=True)
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(output_payload, f, indent=2)

    print(f"Generated {out_file} ({len(monthly_series)} monthly series records, {len(crises)} crises, {total_records} trading days analyzed).")

if __name__ == "__main__":
    main()
