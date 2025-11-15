import pytest
import pandas as pd
import numpy as np
from preprocessing.preprocessor import DataPreprocessor

@pytest.fixture
def dirty_data():
    """A pytest fixture as sample data for tests."""
    return pd.DataFrame({
        'Age': [25, 30, np.nan, 35],       # Numeric, has NaN
        'Salary': [50000, 60000, 70000, 80000], # Numeric, no NaN
        'Country': ['USA', 'Canada', 'USA', np.nan], # Categorical, has NaN
        'Purchased': [0, 1, 0, 1]          # This will be our target
    })

def test_preprocessor_fit_transform(dirty_data):
    """
    Tests the full fit_transform pipeline on the DataPreprocessor class.
    """
    X = dirty_data.drop('Purchased', axis=1) 
    
    preprocessor = DataPreprocessor() 
    
    df = preprocessor.fit_transform(X)
    
    assert df.shape == (4, 3) 
    
    expected_cols = ['num__Age', 'num__Salary', 'cat__Country_USA']
    assert all(col in df.columns for col in expected_cols)
    
    assert df.isnull().sum().sum() == 0

    assert df.iloc[2, 0] == 0.0 # The imputed mean (30) becomes 0 after scaling
    
    assert df['cat__Country_USA'].iloc[3] == 1.0