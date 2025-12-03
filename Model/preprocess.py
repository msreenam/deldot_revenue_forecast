import pandas as pd
import os

from preprocessing.preprocessor import DataPreprocessor
from preprocessing.utils import load_data
from preprocessing.utils import save_processed_data


file_path = os.path.join('External_Data', 'TOTALSA.csv')
df = pd.read_csv(file_path)

preprocessor = DataPreprocessor()

df = load_data(file_path)

X, y = df.drop('TOTALSA',axis=1), df['TOTALSA']

