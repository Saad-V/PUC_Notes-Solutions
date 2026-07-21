import pandas as pd
import re
from urllib.parse import urlparse

df = pd.read_csv("raw_pdf_inventory_with_text.csv")

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

def infer_resource_type(slug, link_text):
    s = f"{slug} {str(link_text).lower()}"

    if "textbook" in s:
        return "textbook"
    if "model" in s:
        return "model_paper"
    if "question bank" in s or "question-bank" in s:
        return "question_bank"
    if "solved" in s:
        return "solved_paper"
    if "previous" in s:
        return "previous_year_paper"
    if "notes" in s:
        return "chapter_notes"
    return "unknown"

df["file_id"] = df["pdf_url"].apply(extract_file_id)
df["page_slug"] = df["page_url"].apply(get_slug)
df["subject"] = df["page_slug"].apply(infer_subject)
df["page_type"] = df["page_slug"].apply(infer_page_type)
df["resource_type"] = df.apply(
    lambda row: infer_resource_type(row["page_slug"], row["link_text"]),
    axis=1
)
df["chapter_name"] = ""
df["notes"] = ""

df = df.drop_duplicates(subset=["page_url", "link_text", "pdf_url"]).reset_index(drop=True)

df = df[
    [
        "page_url",
        "page_slug",
        "link_text",
        "pdf_url",
        "file_id",
        "subject",
        "page_type",
        "resource_type",
        "chapter_name",
        "notes"
    ]
]

df.to_csv("pdf_inventory_enriched.csv", index=False)
print("Saved pdf_inventory_enriched.csv")
print("Rows:", len(df))
print("Unique files:", df["file_id"].nunique())