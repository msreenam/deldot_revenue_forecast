import pandas as pd

data_1 = pd.read_csv('External_Data\TOTALSA.csv')

print(data_1.head(10))

print(data_1.isna().sum)