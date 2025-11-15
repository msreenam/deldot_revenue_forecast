# Preprocessing Pipeline

This is a preprocessing pipeline leveraging `pandas` and `scikit-learn`. 
This is mainly for developing and working on datasets that can be fit into memory.
For larger datasets (50G, 100G, ...) we would need to parallelize the pipeline and conver to non memory storage methods like databases.


# Features
* **Data Splitting:** Correctly splits data into training and test sets before fitting.

* **Numeric Pipeline:**

  * Imputation: Fills missing numeric data with the column's mean.

  * Scaling: Applies StandardScaler to all numeric features.

* **Categorical Pipeline:**

  * Imputation: Fills missing categorical data with the most frequent value (mode).

  * Encoding: Applies OneHotEncoder to all categorical features.


# How to Use
1. Import the package into your file:
```py
from preprocessing.preprocessor import DataPreprocessor
from preprocessing.utils.load_data import load_data
from preprocessing.utils.save_to_file import save_processed_data

preprocessor = DataPreprocessor()

```

2. TBD: load your data, split data. then use the fit in DataPreprocessor
```py
# 1. Change this to your file's path
input_file = "my_data.csv"

# 2. Change this to your target's column name
target_column = "NameOfYourTargetColumn"

# 3. Change this to your desired output folder
output_dir = "output"
```