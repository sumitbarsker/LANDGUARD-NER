import pandas as pd


INPUT_FILE = "data/processed/landslide_clean.csv"
OUTPUT_FILE = "data/processed/ner_landslides.csv"


NER_STATES = {
    "arunachal pradesh",
    "assam",
    "manipur",
    "meghalaya",
    "mizoram",
    "nagaland",
    "sikkim",
    "tripura"
}


def prepare_ner_data():

    print("Loading cleaned landslide data...")

    df = pd.read_csv(INPUT_FILE)

    print("Original records:", len(df))

    # Clean state names
    df["State"] = (
        df["State"]
        .astype(str)
        .str.strip()
        .str.lower()
    )

    # Remove accidental prefix from Arunachal Pradesh
    df["State"] = df["State"].str.replace(
        "-arunachal pradesh",
        "arunachal pradesh",
        regex=False
    )

    # Normalize common uppercase entries
    df["State"] = df["State"].str.replace(
        "meghalaya",
        "meghalaya",
        regex=False
    )

    # Keep only Northeast Region states
    df = df[df["State"].isin(NER_STATES)].copy()

    # Convert state names to proper format
    state_names = {
        "arunachal pradesh": "Arunachal Pradesh",
        "assam": "Assam",
        "manipur": "Manipur",
        "meghalaya": "Meghalaya",
        "mizoram": "Mizoram",
        "nagaland": "Nagaland",
        "sikkim": "Sikkim",
        "tripura": "Tripura"
    }

    df["State"] = df["State"].map(state_names)

    # Sort by state and district
    df = df.sort_values(
        by=["State", "District"]
    )

    df = df.reset_index(drop=True)

    # Save NER dataset
    df.to_csv(
        OUTPUT_FILE,
        index=False
    )

    print("\nNER dataset created successfully.")
    print("Total NER records:", len(df))

    print("\nState-wise distribution:")
    print(
        df["State"].value_counts()
    )

    print("\nSaved at:")
    print(OUTPUT_FILE)


if __name__ == "__main__":
    prepare_ner_data()