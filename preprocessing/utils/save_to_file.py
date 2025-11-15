import pandas as pd
import os


def save_processed_data(X_df: pd.DataFrame, y_series: pd.Series, output_dir: str, prefix: str):
    """Saves the processed features and target to CSV."""
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    X_df.to_csv(os.path.join(output_dir, f"{prefix}_features.csv"), index=False)
    y_series.to_csv(os.path.join(output_dir, f"{prefix}_target.csv"), index=False)
