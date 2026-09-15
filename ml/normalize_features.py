import pandas as pd


INPUT_FILE = "data/processed/ml_ready_landslides.csv"
OUTPUT_FILE = "data/processed/features_ready.csv"


def normalize_features():

    print("Loading ML dataset...")

    df = pd.read_csv(INPUT_FILE)

    print("Original records:", len(df))

    # Clean material names
    df["Material Involved"] = (
        df["Material Involved"]
        .fillna("Unknown")
        .astype(str)
        .str.strip()
        .str.lower()
    )

    material_map = {
        "rock cum debris": "Rock cum Debris",
        "rock-cum-debris": "Rock cum Debris",
        "rock cum debris ": "Rock cum Debris",
        "soil cum debris": "Soil cum Debris",
        "debris cum earth": "Debris cum Earth",
        "loose debris": "Debris",
        "compacted debris": "Debris",
        "insitu earth": "Earth"
    }

    df["Material Involved"] = (
        df["Material Involved"]
        .replace(material_map)
        .str.title()
    )

    # Clean movement type
    df["Movement Type"] = (
        df["Movement Type"]
        .fillna("Unknown")
        .astype(str)
        .str.strip()
        .str.lower()
    )

    movement_map = {
        "slide": "Slide",
        "debris slide": "Debris Slide",
        "rock slide": "Rock Slide",
        "soil slide": "Soil Slide",
        "flow": "Flow",
        "fall": "Fall",
        "complex": "Complex",
        "composite": "Composite",
        "subsidence": "Subsidence",
        "topple": "Topple",
        "creep": "Creep",
        "wedge failure": "Wedge Failure",
        "nil": "Unknown"
    }

    df["Movement Type"] = (
        df["Movement Type"]
        .replace(movement_map)
        .str.title()
    )

    # Clean state and district names
    df["State"] = (
        df["State"]
        .astype(str)
        .str.strip()
    )

    df["District"] = (
        df["District"]
        .fillna("Unknown")
        .astype(str)
        .str.strip()
    )

    # Make sure coordinates are numeric
    df["Latitude"] = pd.to_numeric(
        df["Latitude"],
        errors="coerce"
    )

    df["Longitude"] = pd.to_numeric(
        df["Longitude"],
        errors="coerce"
    )

    # Remove invalid coordinates
    df = df.dropna(
        subset=["Latitude", "Longitude"]
    )

    df = df.reset_index(drop=True)

    df.to_csv(
        OUTPUT_FILE,
        index=False
    )

    print("\nFeature normalization completed.")

    print("Final records:", len(df))

    print("\nMaterial categories:")
    print(df["Material Involved"].value_counts())

    print("\nMovement categories:")
    print(df["Movement Type"].value_counts())

    print("\nSaved at:")
    print(OUTPUT_FILE)


if __name__ == "__main__":
    normalize_features()