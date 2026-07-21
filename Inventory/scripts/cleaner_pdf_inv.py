import pandas as pd
import re
from urllib.parse import urlparse

# INPUT FILE:
# raw_pdf_inventory.csv should have 2 columns with no header:
# page_url,pdf_url

df = pd.read_csv("pdf_inventory.csv", header=None, names=["page_url", "pdf_url"])

def extract_file_id(url):
    m = re.search(r"/file/d/([^/]+)/", str(url))
    if m:
        return m.group(1)
    return ""

def get_slug(page_url):
    path = urlparse(page_url).path.strip("/")
    return path if path else "home"

def infer_subject(slug):
    subjects = [
        "physics","chemistry","mathematics","biology","computer-science",
        "electronics","statistics","history","accountancy","economics",
        "business-studies","english","hindi","kannada"
    ]
    for s in subjects:
        if s in slug:
            return s.replace("-", " ").title()
    return ""

def infer_page_type(slug):
    if "notes" in slug:
        return "notes_page"
    return "resource_page"

def infer_resource_type(slug):
    if "textbook" in slug:
        return "textbook"
    if "model" in slug:
        return "model_paper"
    if "question-bank" in slug:
        return "question_bank"
    if "solved" in slug:
        return "solved_paper"
    if "previous" in slug:
        return "previous_year_paper"
    if "notes" in slug:
        return "chapter_notes"
    return "unknown"

df["file_id"] = df["pdf_url"].apply(extract_file_id)
df["page_slug"] = df["page_url"].apply(get_slug)
df["subject"] = df["page_slug"].apply(infer_subject)
df["page_type"] = df["page_slug"].apply(infer_page_type)
df["resource_type"] = df["page_slug"].apply(infer_resource_type)
df["chapter_name"] = ""
df["notes"] = ""

# Remove exact duplicate page+pdf pairs
df = df.drop_duplicates(subset=["page_url", "pdf_url"]).reset_index(drop=True)

# Reorder columns
df = df[
    [
        "page_url",
        "page_slug",
        "pdf_url",
        "file_id",
        "subject",
        "page_type",
        "resource_type",
        "chapter_name",
        "notes"
    ]
]

df.to_csv("pdf_inventory_cleaned.csv", index=False)
print("Saved: pdf_inventory_cleaned.csv")
print(f"Rows: {len(df)}")
print(f"Unique files: {df['file_id'].nunique()}")