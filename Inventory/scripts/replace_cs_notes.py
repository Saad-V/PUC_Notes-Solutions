import csv
import json
import os
import subprocess
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_DIR = os.path.join(BASE_DIR, 'content')
CSV_PATH = os.path.join(CONTENT_DIR, 'pdf_inventory_enriched.csv')

# Corrected mapping provided by user
new_topics = [
    ("Computer System", "https://drive.google.com/file/d/1srNj8IPn01DPs8a5T0xh6TyrJ5z0h-17/view?usp=sharing", "1srNj8IPn01DPs8a5T0xh6TyrJ5z0h-17"),
    ("Encoding Schemes and Number System", "https://drive.google.com/file/d/1U5bEJmbBj3AdZzjFhhdaaE2zaZBsn_Ci/view?usp=sharing", "1U5bEJmbBj3AdZzjFhhdaaE2zaZBsn_Ci"),
    ("Emerging Trends", "https://drive.google.com/file/d/1IqyTNEdSZI9Ub_ybrZOS3odWtMH1tHT7/view?usp=sharing", "1IqyTNEdSZI9Ub_ybrZOS3odWtMH1tHT7"),
    ("Problem Solving", "https://drive.google.com/file/d/1ZpCIgqWiM5p9DE31qj2Xu4uzaWVSJgPs/view?usp=sharing", "1ZpCIgqWiM5p9DE31qj2Xu4uzaWVSJgPs"),
    ("Getting Started with Python", "https://drive.google.com/file/d/1ANDc8DEBvF65ul8eWfRC60tnrP2TLcZA/view?usp=sharing", "1ANDc8DEBvF65ul8eWfRC60tnrP2TLcZA"),
    ("Flow of Control", "https://drive.google.com/file/d/1QabtwWJRwSRzf_Fhw5oFOzb_fw7StmC6/view?usp=sharing", "1QabtwWJRwSRzf_Fhw5oFOzb_fw7StmC6"),
    ("Functions", "https://drive.google.com/file/d/1GqTFOhQedyE3MUmPkkejgELM8M7fCFKS/view?usp=sharing", "1GqTFOhQedyE3MUmPkkejgELM8M7fCFKS"),
    ("Strings", "https://drive.google.com/file/d/1sn3-Ii8TCSDbZ3vdkV6S1txr_ZuxHxzC/view?usp=sharing", "1sn3-Ii8TCSDbZ3vdkV6S1txr_ZuxHxzC"),
    ("Lists", "https://drive.google.com/file/d/1HLx9I8CfBkr6pBUSEx24iWNRJMzuCUlm/view?usp=sharing", "1HLx9I8CfBkr6pBUSEx24iWNRJMzuCUlm"),
    ("Tuples and Dictionary", "https://drive.google.com/file/d/1y7-NfKHxo5whjO0Rf78z9g3ccUK-fqdA/view?usp=sharing", "1y7-NfKHxo5whjO0Rf78z9g3ccUK-fqdA"),
    ("Societal Impacts", "https://drive.google.com/file/d/1a988-JNE465gLKPW666G26AqnZjBLU-W/view?usp=sharing", "1a988-JNE465gLKPW666G26AqnZjBLU-W"),
]

# 1. Read existing CSV rows
rows = []
headers = ["page_url", "page_slug", "pdf_url", "file_id", "subject", "page_type", "resource_type", "link_text", "chapter_name", "notes"]

if os.path.exists(CSV_PATH):
    with open(CSV_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        if reader.fieldnames:
            headers = reader.fieldnames
        for r in reader:
            # Filter out existing chapter_notes for 1st-pu-notes-computer-science & 1st-puc-computer-science
            slug = r.get('page_slug', '')
            res_type = r.get('resource_type', '')
            if slug in ('1st-pu-notes-computer-science', '1st-puc-computer-science') and res_type == 'chapter_notes':
                continue
            rows.append(r)

# 2. Append 11 updated chapter notes
notes_slug = '1st-pu-notes-computer-science'
for idx, (topic, url, file_id) in enumerate(new_topics, 1):
    link_text = f"Chapter {idx:02d}: {topic}"
    new_row = {
        "page_url": f"https://www.pucnotes-solutions.com/{notes_slug}",
        "page_slug": notes_slug,
        "pdf_url": url,
        "file_id": file_id,
        "subject": "Computer Science",
        "page_type": "notes_page",
        "resource_type": "chapter_notes",
        "link_text": link_text,
        "chapter_name": topic,
        "notes": "Official 1st PUC Computer Science Chapter Notes"
    }
    rows.append(new_row)

# 3. Write back to CSV
with open(CSV_PATH, 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=headers)
    writer.writeheader()
    writer.writerows(rows)

print(f"[OK] Replaced 1st PUC Computer Science notes with corrected mapping ({len(new_topics)} items).")

# 4. Regenerate all JSON files
gen_script = os.path.join(BASE_DIR, 'scripts', 'generate_data.py')
subprocess.run([sys.executable, gen_script], check=True)
