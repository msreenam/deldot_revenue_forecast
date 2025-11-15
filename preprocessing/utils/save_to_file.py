import pandas as pd
import os
from exception import UnsupportedFileFormatError


def save_processed_data(X_df: pd.DataFrame, y_series: pd.Series, output_dir: str, prefix: str,output_type: str= 'csv'):
    
    if not isinstance(X_df, pd.DataFrame):
        raise TypeError(f"X_df must be a pandas DataFrame, not {type(X_df)}")
    if not isinstance(y_series, pd.Series):
        raise TypeError(f"y_series must be a pandas Series, not {type(y_series)}")
    if not X_df.empty or not y_series.empty:
        raise ValueError("The provided DataFrame or Series is empty and cannot be saved.")
    
    """Saves the processed features and target to CSV."""
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    if output_type == 'csv':
        X_df.to_csv(os.path.join(output_dir, f"{prefix}_features.csv"), index=False)
        y_series.to_csv(os.path.join(output_dir, f"{prefix}_target.csv"), index=False)
    elif output_type == 'xlsx':
        X_df.to_csv(os.path.join(output_dir, f"{prefix}_features.csv"), index=False)
        y_series.to_csv(os.path.join(output_dir, f"{prefix}_target.csv"), index=False)

    raise UnsupportedFileFormatError(f"The output type, {output_type}, is not available.")
