import pandas as pd


INPUT_FILE = "data/processed/ner_landslides.csv"
OUTPUT_FILE = "data/processed/ml_ready_landslides.csv"


def prepare_ml_data():

    print("Loading NER landslide data...")

    df = pd.read_csv(INPUT_FILE)

    print("Original records:", len(df))

    # Keep coordinates inside the approximate NER region
    valid_coordinates = (
        (df["Latitude"] >= 20) &
        (df["Latitude"] <= 30) &
        (df["Longitude"] >= 88) &
        (df["Longitude"] <= 98)
    )

    df = df[valid_coordinates].copy()

    # Keep useful features for the first ML dataset
    columns = [
        "State",
        "District",
        "Latitude",
        "Longitude",
        "Material Involved",
        "Movement Type"
    ]

    df = df[columns]

    # Remove rows missing important information
    df = df.dropna(
        subset=[
            "State",
            "District",
            "Latitude",
            "Longitude"
        ]
    )

    # Clean text values
    for column in [
        "State",
        "District",
        "Material Involved",
        "Movement Type"
    ]:

        df[column] = (
            df[column]
            .fillna("Unknown")
            .astype(str)
            .str.strip()
        )

    # Remove duplicate locations
    df = df.drop_duplicates(
        subset=[
            "State",
            "District",
            "Latitude",
            "Longitude"
        ]
    )

    df = df.reset_index(drop=True)

    df.to_csv(
        OUTPUT_FILE,
        index=False
    )

    print("\nML dataset created successfully.")
    print("Final records:", len(df))

    print("\nColumns:")
    print(df.columns.tolist())

    print("\nState distribution:")
    print(df["State"].value_counts())

    print("\nSaved at:")
    print(OUTPUT_FILE)


if __name__ == "__main__":
    prepare_ml_data()