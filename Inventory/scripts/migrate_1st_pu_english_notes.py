"""
Migrate 1st PU English notes:
1. Copy old entries from "1st-pu-notes-english" to "1st-pu-notes-english-archive" with resourceType "old_notes"
2. Replace "1st-pu-notes-english" with new chapter-wise notes
3. Register archive slug in slug-registry.json
"""

import json
import os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_DIR = os.path.join(BASE, "content")
RESOURCES_PATH = os.path.join(CONTENT_DIR, "resources.json")
SLUG_REGISTRY_PATH = os.path.join(CONTENT_DIR, "slug-registry.json")

NEW_NOTES = [
    {
        "id": "1QRL-cdxKPA1_gPhtWTUMaxOuwF3jjGlK",
        "linkText": "Chapter-01",
        "pdfUrl": "https://drive.google.com/file/d/1QRL-cdxKPA1_gPhtWTUMaxOuwF3jjGlK/view?usp=sharing",
        "fileId": "1QRL-cdxKPA1_gPhtWTUMaxOuwF3jjGlK",
        "subject": "English",
        "resourceType": "chapter_notes",
        "chapterName": "The Gentlemen of the Jungle (Jomo Kenyatta)",
        "notes": ""
    },
    {
        "id": "13apZPIP5waNLBX0mL1-tCuZxY-7e5hQv",
        "linkText": "Chapter-02",
        "pdfUrl": "https://drive.google.com/file/d/13apZPIP5waNLBX0mL1-tCuZxY-7e5hQv/view?usp=sharing",
        "fileId": "13apZPIP5waNLBX0mL1-tCuZxY-7e5hQv",
        "subject": "English",
        "resourceType": "chapter_notes",
        "chapterName": "The School Boy (William Blake)",
        "notes": ""
    },
    {
        "id": "1OmTFO6ENuqm2B8PoxC-4Pwv6XEyTwQE9",
        "linkText": "Chapter-03",
        "pdfUrl": "https://drive.google.com/file/d/1OmTFO6ENuqm2B8PoxC-4Pwv6XEyTwQE9/view?usp=sharing",
        "fileId": "1OmTFO6ENuqm2B8PoxC-4Pwv6XEyTwQE9",
        "subject": "English",
        "resourceType": "chapter_notes",
        "chapterName": "Around a Medicinal Creeper (K. P. Poornachandra Tejaswi)",
        "notes": ""
    },
    {
        "id": "1GMcPa89VPgZr7Wg4c1SLb1DkWTSp3cYN",
        "linkText": "Chapter-04",
        "pdfUrl": "https://drive.google.com/file/d/1GMcPa89VPgZr7Wg4c1SLb1DkWTSp3cYN/view?usp=sharing",
        "fileId": "1GMcPa89VPgZr7Wg4c1SLb1DkWTSp3cYN",
        "subject": "English",
        "resourceType": "chapter_notes",
        "chapterName": "Oru Manushyan (Vaikom Muhammad Basheer)",
        "notes": ""
    },
    {
        "id": "1XQKKUjucGcdZ-Ltc-dP8ROpnjKkK8Y2P",
        "linkText": "Chapter-05",
        "pdfUrl": "https://drive.google.com/file/d/1XQKKUjucGcdZ-Ltc-dP8ROpnjKkK8Y2P/view?usp=sharing",
        "fileId": "1XQKKUjucGcdZ-Ltc-dP8ROpnjKkK8Y2P",
        "subject": "English",
        "resourceType": "chapter_notes",
        "chapterName": "Money Madness (D. H. Lawrence)",
        "notes": ""
    },
    {
        "id": "1iIcSn2jyyO--lC2c5LSzkS_3glLfLgGs",
        "linkText": "Chapter-06",
        "pdfUrl": "https://drive.google.com/file/d/1iIcSn2jyyO--lC2c5LSzkS_3glLfLgGs/view?usp=sharing",
        "fileId": "1iIcSn2jyyO--lC2c5LSzkS_3glLfLgGs",
        "subject": "English",
        "resourceType": "chapter_notes",
        "chapterName": "Babar Ali (Samarpita Mukherjee Sharma)",
        "notes": ""
    },
    {
        "id": "1ptGgw7h5EPb9b2tWA_g3yHmWEOQdg-Lw",
        "linkText": "Chapter-07",
        "pdfUrl": "https://drive.google.com/file/d/1ptGgw7h5EPb9b2tWA_g3yHmWEOQdg-Lw/view?usp=sharing",
        "fileId": "1ptGgw7h5EPb9b2tWA_g3yHmWEOQdg-Lw",
        "subject": "English",
        "resourceType": "chapter_notes",
        "chapterName": "If I was a Tree (Mudnakudu Chinnaswamy)",
        "notes": ""
    },
    {
        "id": "1CZft6aYmnPEinChtixhmUIL66ICGCxst",
        "linkText": "Chapter-08",
        "pdfUrl": "https://drive.google.com/file/d/1CZft6aYmnPEinChtixhmUIL66ICGCxst/view?usp=sharing",
        "fileId": "1CZft6aYmnPEinChtixhmUIL66ICGCxst",
        "subject": "English",
        "resourceType": "chapter_notes",
        "chapterName": "Watchman of the Lake (R. K. Narayan)",
        "notes": ""
    },
    {
        "id": "11xC0kLm49JEiwfTrUmHtTVoiSdV4oqHO",
        "linkText": "Chapter-09",
        "pdfUrl": "https://drive.google.com/file/d/11xC0kLm49JEiwfTrUmHtTVoiSdV4oqHO/view?usp=sharing",
        "fileId": "11xC0kLm49JEiwfTrUmHtTVoiSdV4oqHO",
        "subject": "English",
        "resourceType": "chapter_notes",
        "chapterName": "The Farmer's Wife (Volga)",
        "notes": ""
    },
    {
        "id": "1ZmkOOGrxzc4x8aMO7aP_TKLBV1GDcTLC",
        "linkText": "Chapter-10",
        "pdfUrl": "https://drive.google.com/file/d/1ZmkOOGrxzc4x8aMO7aP_TKLBV1GDcTLC/view?usp=sharing",
        "fileId": "1ZmkOOGrxzc4x8aMO7aP_TKLBV1GDcTLC",
        "subject": "English",
        "resourceType": "chapter_notes",
        "chapterName": "Frederick Douglass (Frederick Douglass)",
        "notes": ""
    },
    {
        "id": "1Tz9qCptQ4FG-XAu-JfCkpd0Yme6oYmY0",
        "linkText": "Chapter-11",
        "pdfUrl": "https://drive.google.com/file/d/1Tz9qCptQ4FG-XAu-JfCkpd0Yme6oYmY0/view?usp=sharing",
        "fileId": "1Tz9qCptQ4FG-XAu-JfCkpd0Yme6oYmY0",
        "subject": "English",
        "resourceType": "chapter_notes",
        "chapterName": "An Old Woman (Arun Kolatkar)",
        "notes": ""
    },
    {
        "id": "1eDjlhFCpyP7FCtMQrHDK3IigeLt1uuAt",
        "linkText": "Chapter-12",
        "pdfUrl": "https://drive.google.com/file/d/1eDjlhFCpyP7FCtMQrHDK3IigeLt1uuAt/view?usp=sharing",
        "fileId": "1eDjlhFCpyP7FCtMQrHDK3IigeLt1uuAt",
        "subject": "English",
        "resourceType": "chapter_notes",
        "chapterName": "Two Gentlemen of Verona (A. J. Cronin)",
        "notes": ""
    },
    {
        "id": "1ckoZv2UpBuOfo9hY4ah3OWInXvroSg9V",
        "linkText": "Chapter-13",
        "pdfUrl": "https://drive.google.com/file/d/1ckoZv2UpBuOfo9hY4ah3OWInXvroSg9V/view?usp=sharing",
        "fileId": "1ckoZv2UpBuOfo9hY4ah3OWInXvroSg9V",
        "subject": "English",
        "resourceType": "chapter_notes",
        "chapterName": "Do not ask of Me, My Love (Faiz Ahmad Faiz)",
        "notes": ""
    }
]


def migrate():
    # --- 1. Update resources.json ---
    with open(RESOURCES_PATH, "r", encoding="utf-8") as f:
        resources = json.load(f)

    old_key = "1st-pu-notes-english"
    archive_key = "1st-pu-notes-english-archive"

    if old_key not in resources:
        print(f"ERROR: Key '{old_key}' not found in resources.json")
        return

    old_entries = resources[old_key]
    print(f"Found {len(old_entries)} old entries under '{old_key}'")

    # Mark old entries as old_notes and save to archive
    for entry in old_entries:
        entry["resourceType"] = "old_notes"
    resources[archive_key] = old_entries
    print(f"Created archive key '{archive_key}' with {len(old_entries)} entries (resourceType='old_notes')")

    # Replace with new data
    resources[old_key] = NEW_NOTES
    print(f"Replaced '{old_key}' with {len(NEW_NOTES)} new entries")

    with open(RESOURCES_PATH, "w", encoding="utf-8") as f:
        json.dump(resources, f, indent=2, ensure_ascii=False)
    print("Saved resources.json")

    # --- 2. Update slug-registry.json ---
    with open(SLUG_REGISTRY_PATH, "r", encoding="utf-8") as f:
        registry = json.load(f)

    if archive_key not in registry:
        registry[archive_key] = {
            "type": "subject",
            "entityId": "1st-pu-english",
            "subType": "notes-archive"
        }
        with open(SLUG_REGISTRY_PATH, "w", encoding="utf-8") as f:
            json.dump(registry, f, indent=2, ensure_ascii=False)
        print(f"Added '{archive_key}' to slug-registry.json")
    else:
        print(f"'{archive_key}' already exists in slug-registry.json")

    print("\nMigration complete!")
    print(f"   Old notes archived under: /{archive_key}")
    print(f"   New notes live under: /{old_key}")


if __name__ == "__main__":
    migrate()
