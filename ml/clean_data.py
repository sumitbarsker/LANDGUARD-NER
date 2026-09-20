import pandas as pd
import os


INPUT_FILE = "data/processed/landslide_inventory.csv"
OUTPUT_FILE = "data/processed/landslide_clean.csv"


def clean_landslide_data():

    print("Loading landslide inventory...")

    df = pd.read_csv(INPUT_FILE, header=None)

    print("Original shape:", df.shape)

    # Row 0 contains CSV-generated column numbers
    # Row 1 contains the report title
    # Row 2 contains the actual table headers

    header = df.iloc[2].tolist()

    # Actual data starts from row 3
    df = df.iloc[3:].copy()

    # Apply actual headers
    df.columns = header

    # Remove empty rows
    df = df.dropna(axis=0, how="all")

    # Clean column names
    df.columns = [
        str(column).strip().replace("\n", " ")
        for column in df.columns
    ]

    print("\nColumns found:")
    print(df.columns.tolist())

    # Convert coordinates to numeric
    df["Latitude"] = pd.to_numeric(
        df["Latitude"],
        errors="coerce"
    )

    df["Longitude"] = pd.to_numeric(
        df["Longitude"],
        errors="coerce"
    )

    # Remove records without valid coordinates
    df = df.dropna(
        subset=["Latitude", "Longitude"]
    )

    # Remove duplicate slide records
    if "Slide_No" in df.columns:
        df = df.drop_duplicates(
            subset=["Slide_No"]
        )

    # Clean text columns
    for column in df.columns:

        if column not in ["Latitude", "Longitude"]:

            df[column] = (
                df[column]
                .astype(str)
                .str.strip()
            )

    # Reset row numbers
    df = df.reset_index(drop=True)

    # Create output directory
    os.makedirs(
        "data/processed",
        exist_ok=True
    )

    # Save cleaned dataset
    df.to_csv(
        OUTPUT_FILE,
        index=False
    )

    print("\nCleaning completed successfully.")

    print("Final shape:", df.shape)

    print("\nFirst 5 records:")
    print(
        df.head().to_string(index=False)
    )

    print("\nStates found:")
    print(
        df["State"].value_counts()
    )

    print("\nMissing values:")
    print(
        df.isnull().sum()
    )

    print("\nSaved at:")
    print(OUTPUT_FILE)


if __name__ == "__main__":
    clean_landslide_data()
