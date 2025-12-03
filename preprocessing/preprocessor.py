import pandas as pd
import numpy as np
from scipy.sparse import spmatrix
from sklearn.exceptions import NotFittedError
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.base import BaseEstimator, TransformerMixin
import os

class DateFeatureExtractor(BaseEstimator, TransformerMixin):
    """
    Extracts Year, Month, Day, DayOfWeek from date columns.
    Does not mutate the original DataFrame.
    """
    def fit(self, X, y=None):
        # Store input feature names to support get_feature_names_out
        self.feature_names_in_ = list(X.columns) if hasattr(X, "columns") else [f"x{i}" for i in range(X.shape[1])]
        return self

    def transform(self, X):
        # Ensure input is a DataFrame
        if not isinstance(X, pd.DataFrame):
            X = pd.DataFrame(X, columns=self.feature_names_in_)

        # List to hold the new feature DataFrames
        output_dfs = []
        
        for col in self.feature_names_in_:
            dt_series = pd.to_datetime(X[col], errors='coerce').dt
            
        
            output_dfs.append(pd.DataFrame({
                f"{col}_year": dt_series.year,
                f"{col}_month": dt_series.month,
                f"{col}_day": dt_series.day,
                f"{col}_dow": dt_series.dayofweek
            }, index=X.index))
            
        return pd.concat(output_dfs, axis=1)

    def get_feature_names_out(self, input_features=None):
        attrs = ["year", "month", "day", "dow"]
        return [f"{col}_{attr}" for col in self.feature_names_in_ for attr in attrs]

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
        self.datetime_features_ = X.select_dtypes(include=["datetime64", "datetimetz"]).columns.tolist()
        self.categorical_features_ = []

        object_cols = X.select_dtypes(include=["object"]).columns
        
        for col in object_cols:
            try:
                pd.to_datetime(X[col], errors='raise')
                self.datetime_features_.append(col)
                
            except (ValueError, TypeError):         
                self.categorical_features_.append(col)
                
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

        date_pipeline = Pipeline(steps=[
            ("extractor", DateFeatureExtractor()), 
            ("imputer", SimpleImputer(strategy="median")), 
            ("scaler", StandardScaler())
        ])

        preprocessor = ColumnTransformer(
            transformers=[
                ("num", numeric_pipeline, self.numeric_features_),
                ("cat", categorical_pipeline, self.categorical_features_),
                ("date", date_pipeline, self.datetime_features_),
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
        return pd.DataFrame(X_processed,  columns=self.feature_names_out_, index=X.index)

    def fit_transform(self, X: pd.DataFrame) -> pd.DataFrame:
        """
        Only use this for the training set.
        
        Args:
            X: The data to fit and transform (pd.DataFrame).
        """
        self.fit(X)
        return self.transform(X)
