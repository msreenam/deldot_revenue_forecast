import pandas as pd
import os

from .exception import UnsupportedFileFormatError


def load_data(file_path: str) -> pd.DataFrame:
    """Loads a CSV file into a pandas DataFrame."""
    
    if not isinstance(file_path, str):
        raise TypeError(f"must be a string, not {type(file_path)}")

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"The file {file_path} does not exist.")
    

    
    _, file_extension = os.path.splitext(file_path)
    
    if file_extension == '.csv':
        return pd.read_csv(file_path)
    
    elif file_extension == '.xlsx':
        return pd.read_excel(file_path) 
    
    raise UnsupportedFileFormatError(f"The file is not available.")