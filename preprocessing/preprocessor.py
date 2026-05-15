import pandas as pd
import numpy as np
from scipy.sparse import spmatrix
from sklearn.exceptions import NotFittedError
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
import os


class DataPreprocessor:

    def __init__(self):
        self.preprocessor_ = None
        self.numeric_features_ = []
        self.categorical_features_ = []
        self.feature_names_out_ = []


    def fit(self, X: pd.DataFrame):
        """
        Fits the preprocessor by learning the imputation strategies,
        scaling parameters, and encoding categories from the data.

        **Do not fit the testing data**
        
        Args:
            X: The training features (pd.DataFrame).
        """
        self.numeric_features_ = X.select_dtypes(include=["int64", "float64"]).columns.tolist()
        self.categorical_features_ = X.select_dtypes(include=["object"]).columns.tolist()

        numeric_pipeline = Pipeline(
            steps=[
                ("imputer", SimpleImputer(strategy="mean")),
                ("scaler", StandardScaler()),
            ]
        )

        categorical_pipeline = Pipeline(
            steps=[
                ("imputer", SimpleImputer(strategy="most_frequent")),
                ("encoder", OneHotEncoder(handle_unknown="ignore", drop="first")),
            ]
        )

        preprocessor = ColumnTransformer(
            transformers=[
                ("num", numeric_pipeline, self.numeric_features_),
                ("cat", categorical_pipeline, self.categorical_features_),
            ],
            remainder="passthrough" # Keep any columns not specified
        )

        self.preprocessor_ = preprocessor.fit(X)
        
        self.feature_names_out_ = self.preprocessor_.get_feature_names_out()
        
        return self
    
    def transform(self, X: pd.DataFrame) -> pd.DataFrame:
        """
        Transforms the data using the already-fitted preprocessor.
        
        Args:
            X: The Dataframe
        """
        if self.preprocessor_ is None:
            raise NotFittedError("This DataPreprocessor instance is not fitted yet. "
                                 "Call 'fit' with training data first.")
    
        X_processed = self.preprocessor_.transform(X)
        if isinstance(X_processed, spmatrix):
            X_processed = X_processed.todense()
        
        # Return a DataFrame with the correct feature names
        return pd.DataFrame(X_processed, columns=self.feature_names_out_, index=X.index)

    def clean_data(
        self,
        X: pd.DataFrame,
        vin_column: str = "VIN",
        state_column: str = "State",
        allowed_states=None,
    ) -> pd.DataFrame:
        """
        Cleans raw registration data before fitting or transforming.

        This method performs two required cleaning steps:
        1. Remove duplicate vehicle records by VIN.
        2. Keep only registration rows whose state is inside the allowed scope.

        Args:
            X: The raw registration DataFrame.
            vin_column: Column name for the vehicle identifier.
            state_column: Column name for the registration state.
            allowed_states: A list of allowed state codes. Defaults to ["DE"].
        """
        if allowed_states is None:
            allowed_states = ["DE"]

        if vin_column not in X.columns:
            raise KeyError(f"VIN column '{vin_column}' not found in input data.")
        if state_column not in X.columns:
            raise KeyError(f"State column '{state_column}' not found in input data.")

        cleaned = X.drop_duplicates(subset=[vin_column], keep="first").copy()
        cleaned[state_column] = cleaned[state_column].astype(str).str.upper()
        allowed_states_normalized = [str(s).upper() for s in allowed_states]
        cleaned = cleaned[cleaned[state_column].isin(allowed_states_normalized)].reset_index(drop=True)

        return cleaned

    def fit_transform(self, X: pd.DataFrame) -> pd.DataFrame:
        """
        Only use this for the training set.
        
        Args:
            X: The data to fit and transform (pd.DataFrame).
        """
        self.fit(X)
        return self.transform(X)
