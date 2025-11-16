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
`uv` users:
```sh
foo@bar:~$ uv venv
foo@bar:~$ source .venv/bin/activate  # (or .\.venv\Scripts\activate on Windows)
foo@bar:~$ uv pip install .
```
`pip`:
```sh
foo@bar:~$ python3 -m venv .venv
foo@bar:~$ source .venv/bin/activate  # (or .\.venv\Scripts\activate on Windows)
foo@bar:~$ pip install .
```
1. Import the package into your file:
```py
from preprocessing.preprocessor import DataPreprocessor
from preprocessing.utils.load_data import load_data
from preprocessing.utils.save_to_file import save_processed_data

#initialize the object
preprocessor = DataPreprocessor()

```

2. Loading data
```py
df = load_data("my_data.csv")#file path to csv
```
3. Saving output to files
`save_processed_data` takes `X: pd.Dataframe`, `y : pd.Series`, `output:str`, `prefix:str`
```py
save_processed_data(X,y,'output_dir', 'prefix')
```

# For Developers
`uv` users:
```sh
foo@bar:~$ uv venv
foo@bar:~$ source .venv/bin/activate  # (or .\.venv\Scripts\activate on Windows)
foo@bar:~$ uv pip install -e .[test]
```
`pip`:
```sh
foo@bar:~$ python3 -m venv .venv
foo@bar:~$ source .venv/bin/activate  # (or .\.venv\Scripts\activate on Windows)
foo@bar:~$ pip install .[test]
```
