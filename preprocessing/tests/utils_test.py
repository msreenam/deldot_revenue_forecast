import pytest
import pandas as pd
import os
from preprocessing.utils.load_data import load_data
from preprocessing.utils.save_to_file import save_processed_data

def test_load_data_raises_error():
    """Tests that load_data correctly raises FileNotFoundError."""
    with pytest.raises(FileNotFoundError):
        load_data("non_existent_file.csv")

def test_save_and_load_data(tmp_path):
    """
    Tests that saving and loading data works.
    'tmp_path' is a pytest fixture that creates a temporary directory.
    """
    output_dir = tmp_path
    X_df = pd.DataFrame({'a': [1, 2]})
    y_series = pd.Series([0, 1], name="target")
    
    save_processed_data(X_df, y_series, output_dir, "test")
    
    assert os.path.exists(os.path.join(output_dir, "test_features.csv"))
    assert os.path.exists(os.path.join(output_dir, "test_target.csv"))
    
    loaded_X = load_data(os.path.join(output_dir, "test_features.csv"))
    pd.testing.assert_frame_equal(X_df, loaded_X)