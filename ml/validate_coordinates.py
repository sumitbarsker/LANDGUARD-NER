import pandas as pd


INPUT_FILE = "data/processed/ner_landslides.csv"


def validate_coordinates():

    print("Loading NER landslide data...")

    df = pd.read_csv(INPUT_FILE)

    print("Total records:", len(df))

    # Approximate geographic boundary for Northeast India
    valid = (
        (df["Latitude"] >= 20) &
        (df["Latitude"] <= 30) &
        (df["Longitude"] >= 88) &
        (df["Longitude"] <= 98)
    )

    valid_records = df[valid].copy()
    invalid_records = df[~valid].copy()

    print("\nValid coordinate records:", len(valid_records))
    print("Suspicious coordinate records:", len(invalid_records))

    if len(invalid_records) > 0:

        print("\nSuspicious records:")
        print(
            invalid_records[
                [
                    "State",
                    "District",
                    "Latitude",
                    "Longitude",
                    "Slide_No"
                ]
            ].head(20).to_string(index=False)
        )

    print("\nCoordinate validation completed.")


if __name__ == "__main__":
    validate_coordinates()