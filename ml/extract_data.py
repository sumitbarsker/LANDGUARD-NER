import pdfplumber
import pandas as pd
import os

pdf_path = "data/raw/landslide_report.pdf"
output_path = "data/processed/landslide_inventory.csv"

rows = []

print("Reading PDF...")

with pdfplumber.open(pdf_path) as pdf:

    total_pages = len(pdf.pages)
    print("Total pages:", total_pages)

    for page_number, page in enumerate(pdf.pages, start=1):

        tables = page.extract_tables()

        for table in tables:

            if not table:
                continue

            for row in table:

                if row:
                    clean_row = []

                    for value in row:
                        if value is None:
                            clean_row.append("")
                        else:
                            clean_row.append(str(value).strip())

                    rows.append(clean_row)

        if page_number % 50 == 0:
            print("Processed pages:", page_number)

print("Extraction completed.")

if rows:

    max_columns = max(len(row) for row in rows)

    fixed_rows = []

    for row in rows:
        row = row + [""] * (max_columns - len(row))
        fixed_rows.append(row)

    df = pd.DataFrame(fixed_rows)

    os.makedirs("data/processed", exist_ok=True)

    df.to_csv(output_path, index=False)

    print("CSV created successfully.")
    print("Rows:", len(df))
    print("Columns:", len(df.columns))
    print("Saved at:", output_path)

else:
    print("No table data found.")