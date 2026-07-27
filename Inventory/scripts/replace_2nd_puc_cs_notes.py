import csv
import json
import os
import subprocess
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_DIR = os.path.join(BASE_DIR, 'content')
CSV_PATH = os.path.join(CONTENT_DIR, 'pdf_inventory_enriched.csv')

# 2nd PUC Computer Science 12 Chapters provided by user
new_topics = [
    ("Exception Handling in Python", "https://drive.google.com/file/d/1izw0ravuiiFb0ZBxrKvuncxonFGWze8E/view?usp=sharing", "1izw0ravuiiFb0ZBxrKvuncxonFGWze8E"),
    ("File Handling in Python", "https://drive.google.com/file/d/1STBYPnIn54zQytoxHfhiY_bGyeQkAst-/view?usp=sharing", "1STBYPnIn54zQytoxHfhiY_bGyeQkAst-"),
    ("Stack", "https://drive.google.com/file/d/1N-xTRS--FF7JxkMVTsY_5IdQuMnD0vmJ/view?usp=sharing", "1N-xTRS--FF7JxkMVTsY_5IdQuMnD0vmJ"),
    ("Queue", "https://drive.google.com/file/d/1NauFFBPQ5anLAggJNiq1GGy1uWpQ5aLx/view?usp=sharing", "1NauFFBPQ5anLAggJNiq1GGy1uWpQ5aLx"),
    ("Sorting", "https://drive.google.com/file/d/1CHAabUjBgg0Ud7GT2GRXOF39p9RPG-cd/view?usp=sharing", "1CHAabUjBgg0Ud7GT2GRXOF39p9RPG-cd"),
    ("Searching", "https://drive.google.com/file/d/1dIRCPpzI1-9sm2fNrk2n6cHqQfOi0b0Z/view?usp=sharing", "1dIRCPpzI1-9sm2fNrk2n6cHqQfOi0b0Z"),
    ("Understanding Data", "https://drive.google.com/file/d/1RloKg_RCAKEiVPtIlxMNDxESdytQypOk/view?usp=sharing", "1RloKg_RCAKEiVPtIlxMNDxESdytQypOk"),
    ("Database Concepts", "https://drive.google.com/file/d/1SibulXtAQ_f-n80IIUU03fOeGY4aZZt9/view?usp=sharing", "1SibulXtAQ_f-n80IIUU03fOeGY4aZZt9"),
    ("Structured Query Language", "https://drive.google.com/file/d/1XPWvmCMkIM6u0HndB8d1HX1jCMCGwLNW/view?usp=sharing", "1XPWvmCMkIM6u0HndB8d1HX1jCMCGwLNW"),
    ("Computer Networks", "https://drive.google.com/file/d/1sMF9fW9asxq9ikDXTA8wsLavY7kNJh2n/view?usp=sharing", "1sMF9fW9asxq9ikDXTA8wsLavY7kNJh2n"),
    ("Data Communication", "https://drive.google.com/file/d/10SlWjmcdVfinlIb_7W8e9Uvvtesom3Qt/view?usp=sharing", "10SlWjmcdVfinlIb_7W8e9Uvvtesom3Qt"),
    ("Security Aspects", "https://drive.google.com/file/d/1wwlRBHTnSevbPKczWIyjezkVWHloDssx/view?usp=sharing", "1wwlRBHTnSevbPKczWIyjezkVWHloDssx"),
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
            # Filter out existing chapter_notes for 2nd-pu-notes-computer-science & 2nd-puc-computer-science
            slug = r.get('page_slug', '')
            res_type = r.get('resource_type', '')
            if slug in ('2nd-pu-notes-computer-science', '2nd-puc-computer-science') and res_type == 'chapter_notes':
                continue
            rows.append(r)

# 2. Append 12 new chapter notes
notes_slug = '2nd-pu-notes-computer-science'
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
        "notes": "Official 2nd PUC Computer Science Chapter Notes"
    }
    rows.append(new_row)

# 3. Write back to CSV
with open(CSV_PATH, 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=headers)
    writer.writeheader()
    writer.writerows(rows)

print(f"[OK] Replaced 2nd PUC Computer Science notes with {len(new_topics)} new chapter topics.")

# 4. Regenerate all JSON files
gen_script = os.path.join(BASE_DIR, 'scripts', 'generate_data.py')
subprocess.run([sys.executable, gen_script], check=True)
