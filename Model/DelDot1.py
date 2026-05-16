import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.preprocessing import LabelEncoder
import warnings

warnings.filterwarnings('ignore')

# Load the data
data_1 = pd.read_csv('External_Data/TOTALSA.csv')

print("=" * 60)
print("Data Overview")
print("=" * 60)
print(f"Dataset shape: {data_1.shape}")
print(f"\nFirst 10 rows:")
print(data_1.head(10))
print(f"\nMissing values per column:")
print(data_1.isna().sum())
print(f"\nData types:")
print(data_1.dtypes)
print(f"\nBasic statistics:")
print(data_1.describe())

# Data Preprocessing
print("\n" + "=" * 60)
print("Data Preprocessing")
print("=" * 60)

# Handle missing values
data_cleaned = data_1.dropna()
print(f"Rows after removing NaN: {len(data_cleaned)}")

# Encode categorical columns if any
label_encoders = {}
for column in data_cleaned.select_dtypes(include='object').columns:
    le = LabelEncoder()
    data_cleaned[column] = le.fit_transform(data_cleaned[column].astype(str))
    label_encoders[column] = le
    print(f"Encoded column: {column}")

# Prepare features and target
# Assuming the last numerical column is the target (revenue/sales)
X = data_cleaned.iloc[:, :-1]
y = data_cleaned.iloc[:, -1]

print(f"\nFeatures shape: {X.shape}")
print(f"Target shape: {y.shape}")
print(f"Target variable - Mean: {y.mean():.2f}, Std: {y.std():.2f}")

# Split the data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"\nTrain set size: {X_train.shape[0]}")
print(f"Test set size: {X_test.shape[0]}")

# Train Random Forest Regressor
print("\n" + "=" * 60)
print("Random Forest Regressor Model Training")
print("=" * 60)

rf_model = RandomForestRegressor(
    n_estimators=100,
    max_depth=15,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1,
    verbose=0
)

print("Training model...")
rf_model.fit(X_train, y_train)
print("Model training completed!")

# Model Evaluation
print("\n" + "=" * 60)
print("Model Evaluation")
print("=" * 60)

y_train_pred = rf_model.predict(X_train)
y_test_pred = rf_model.predict(X_test)

train_mse = mean_squared_error(y_train, y_train_pred)
test_mse = mean_squared_error(y_test, y_test_pred)
train_rmse = np.sqrt(train_mse)
test_rmse = np.sqrt(test_mse)
train_mae = mean_absolute_error(y_train, y_train_pred)
test_mae = mean_absolute_error(y_test, y_test_pred)
train_r2 = r2_score(y_train, y_train_pred)
test_r2 = r2_score(y_test, y_test_pred)

print(f"\nTraining Set Metrics:")
print(f"  MSE:  {train_mse:.4f}")
print(f"  RMSE: {train_rmse:.4f}")
print(f"  MAE:  {train_mae:.4f}")
print(f"  R²:   {train_r2:.4f}")

print(f"\nTest Set Metrics:")
print(f"  MSE:  {test_mse:.4f}")
print(f"  RMSE: {test_rmse:.4f}")
print(f"  MAE:  {test_mae:.4f}")
print(f"  R²:   {test_r2:.4f}")

# Feature Importance
print("\n" + "=" * 60)
print("Feature Importance")
print("=" * 60)

feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': rf_model.feature_importances_
}).sort_values('importance', ascending=False)

print(f"\nTop 10 Most Important Features:")
print(feature_importance.head(10).to_string(index=False))

# Make predictions on new data (sample)
print("\n" + "=" * 60)
print("Sample Predictions")
print("=" * 60)

# Use first 5 test samples for demonstration
sample_predictions = rf_model.predict(X_test.head(5))
print(f"\nActual vs Predicted values (first 5 test samples):")
for i in range(5):
    print(f"  Sample {i+1}: Actual={y_test.iloc[i]:.2f}, Predicted={sample_predictions[i]:.2f}")

print("\n" + "=" * 60)
print("Model Training Complete")
print("=" * 60)