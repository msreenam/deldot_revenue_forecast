import pandas as pd
import os


def load_data(file_path: str) -> pd.DataFrame:
    """Loads a CSV file into a pandas DataFrame."""
    if os.path.exists(file_path):
        return pd.read_csv(file_path)
    else:
        raise FileNotFoundError(f"The file {file_path} does not exist.")
