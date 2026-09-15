import pandas as pd
import joblib
import os

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report


INPUT_FILE = "data/processed/features_ready.csv"
MODEL_FILE = "models/landslide_model.pkl"


def train_model():

    print("Loading dataset...")

    df = pd.read_csv(INPUT_FILE)

    print("Records:", len(df))

    # Create a simple target from historical landslide records.
    # Every record in this inventory represents a known landslide location.
    df["landslide"] = 1

    features = [
        "State",
        "District",
        "Latitude",
        "Longitude",
        "Material Involved",
        "Movement Type"
    ]

    X = df[features]
    y = df["landslide"]

    # Keep a small negative class using randomly sampled
    # non-landslide geographic points.
    negative = X.copy()

    negative["Latitude"] = negative["Latitude"].sample(
        frac=1,
        random_state=42
    ).reset_index(drop=True)

    negative["Longitude"] = negative["Longitude"].sample(
        frac=1,
        random_state=42
    ).reset_index(drop=True)

    negative["landslide"] = 0

    positive = X.copy()
    positive["landslide"] = 1

    dataset = pd.concat(
        [positive, negative],
        ignore_index=True
    )

    X = dataset[features]
    y = dataset["landslide"]

    categorical_features = [
        "State",
        "District",
        "Material Involved",
        "Movement Type"
    ]

    numeric_features = [
        "Latitude",
        "Longitude"
    ]

    preprocessor = ColumnTransformer(
        transformers=[
            (
                "categorical",
                OneHotEncoder(
                    handle_unknown="ignore"
                ),
                categorical_features
            ),
            (
                "numeric",
                "passthrough",
                numeric_features
            )
        ]
    )

    model = RandomForestClassifier(
        n_estimators=200,
        random_state=42,
        class_weight="balanced"
    )

    pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("model", model)
        ]
    )

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    print("\nTraining model...")

    pipeline.fit(
        X_train,
        y_train
    )

    predictions = pipeline.predict(
        X_test
    )

    accuracy = accuracy_score(
        y_test,
        predictions
    )

    print("\nModel training completed.")

    print("Accuracy:", round(accuracy * 100, 2), "%")

    print("\nClassification report:")
    print(
        classification_report(
            y_test,
            predictions
        )
    )

    os.makedirs(
        "models",
        exist_ok=True
    )

    joblib.dump(
        pipeline,
        MODEL_FILE
    )

    print("\nModel saved at:")
    print(MODEL_FILE)


if __name__ == "__main__":
    train_model()