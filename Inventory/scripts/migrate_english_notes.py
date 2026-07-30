"""
Migrate 2nd PU English notes:
1. Copy the old entries from "2nd-pu-notes-english" to "2nd-pu-notes-english-archive"
2. Replace "2nd-pu-notes-english" with new chapter-wise notes
3. Add archive slug to slug-registry.json
"""

import json
import os
import shutil

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_DIR = os.path.join(BASE, "content")

RESOURCES_PATH = os.path.join(CONTENT_DIR, "resources.json")
SLUG_REGISTRY_PATH = os.path.join(CONTENT_DIR, "slug-registry.json")

# ---------- New notes data ----------
NEW_NOTES = [
    {
        "id": "1wd9QS9W7m2o8y8uoRAB-PcIQGCDAkI_F",
        "linkText": "Chapter-01",
        "pdfUrl": "https://drive.google.com/file/d/1wd9QS9W7m2o8y8uoRAB-PcIQGCDAkI_F/view?usp=sharing",
        "fileId": "1wd9QS9W7m2o8y8uoRAB-PcIQGCDAkI_F",
        "subject": "English",
        "resourceType": "chapter_notes",
        "chapterName": "Romeo and Juliet (Poem)",
        "notes": ""
    },
    {
        "id": "1lBqLmA7lnOQuRc6hiPo7GuToXcBReJ8h",
        "linkText": "Chapter-02",
        "pdfUrl": "https://drive.google.com/file/d/1lBqLmA7lnOQuRc6hiPo7GuToXcBReJ8h/view?usp=sharing",
        "fileId": "1lBqLmA7lnOQuRc6hiPo7GuToXcBReJ8h",
        "subject": "English",
        "resourceType": "chapter_notes",
        "chapterName": "Too Dear! (Story)",
        "notes": ""
    },
    {
        "id": "1CwxkHi4vc5aup4jjrSFCK8fVAKC0FAra",
        "linkText": "Chapter-03",
        "pdfUrl": "https://drive.google.com/file/d/1CwxkHi4vc5aup4jjrSFCK8fVAKC0FAra/view?usp=sharing",
        "fileId": "1CwxkHi4vc5aup4jjrSFCK8fVAKC0FAra",
        "subject": "English",
        "resourceType": "chapter_notes",
        "chapterName": "On Children (Poem)",
        "notes": ""
    },
    {
        "id": "19Q-kV33gAxIusatrISt9cciqVf3fLWpf",
        "linkText": "Chapter-04",
        "pdfUrl": "https://drive.google.com/file/d/19Q-kV33gAxIusatrISt9cciqVf3fLWpf/view?usp=sharing",
        "fileId": "19Q-kV33gAxIusatrISt9cciqVf3fLWpf",
        "subject": "English",
        "resourceType": "chapter_notes",
        "chapterName": "Everything I Need to Know I Learned in the Forest (Essay)",
        "notes": ""
    },
    {
        "id": "1nIC3e-HQy4Nz5HOK9pahkz9HlZPBuc0V",
        "linkText": "Chapter-05",
        "pdfUrl": "https://drive.google.com/file/d/1nIC3e-HQy4Nz5HOK9pahkz9HlZPBuc0V/view?usp=sharing",
        "fileId": "1nIC3e-HQy4Nz5HOK9pahkz9HlZPBuc0V",
        "subject": "English",
        "resourceType": "chapter_notes",
        "chapterName": "A Sunny Morning (Play)",
        "notes": ""
    },
    {
        "id": "1GHBrJFXt3t8GwO6U4YrqYYnkfUPGIFCh",
        "linkText": "Chapter-06",
        "pdfUrl": "https://drive.google.com/file/d/1GHBrJFXt3t8GwO6U4YrqYYnkfUPGIFCh/view?usp=sharing",
        "fileId": "1GHBrJFXt3t8GwO6U4YrqYYnkfUPGIFCh",
        "subject": "English",
        "resourceType": "chapter_notes",
        "chapterName": "When You Are Old (Poem)",
        "notes": ""
    },
    {
        "id": "1mbFudG0ThWNEYnkujQO9_MBibC7HsDEw",
        "linkText": "Chapter-07",
        "pdfUrl": "https://drive.google.com/file/d/1mbFudG0ThWNEYnkujQO9_MBibC7HsDEw/view?usp=sharing",
        "fileId": "1mbFudG0ThWNEYnkujQO9_MBibC7HsDEw",
        "subject": "English",
        "resourceType": "chapter_notes",
        "chapterName": "The Gardener (Story)",
        "notes": ""
    },
    {
        "id": "1N-3P7IGLW-lgdB7RHNjSVM-riUUNuy4K",
        "linkText": "Chapter-08",
        "pdfUrl": "https://drive.google.com/file/d/1N-3P7IGLW-lgdB7RHNjSVM-riUUNuy4K/view?usp=sharing",
        "fileId": "1N-3P7IGLW-lgdB7RHNjSVM-riUUNuy4K",
        "subject": "English",
        "resourceType": "chapter_notes",
        "chapterName": "To the Foot from its Child (Poem)",
        "notes": ""
    },
    {
        "id": "18sKYyHD2If5X78PmLm_94rBfTXgKJRFm",
        "linkText": "Chapter-09",
        "pdfUrl": "https://drive.google.com/file/d/18sKYyHD2If5X78PmLm_94rBfTXgKJRFm/view?usp=sharing",
        "fileId": "18sKYyHD2If5X78PmLm_94rBfTXgKJRFm",
        "subject": "English",
        "resourceType": "chapter_notes",
        "chapterName": "I Believe Books Will Never Disappear (Interview)",
        "notes": ""
    },
    {
        "id": "1I9qDQJ3_nzK7kG1xvyW2dp2ROI0AHTRq",
        "linkText": "Chapter-10",
        "pdfUrl": "https://drive.google.com/file/d/1I9qDQJ3_nzK7kG1xvyW2dp2ROI0AHTRq/view?usp=sharing",
        "fileId": "1I9qDQJ3_nzK7kG1xvyW2dp2ROI0AHTRq",
        "subject": "English",
        "resourceType": "chapter_notes",
        "chapterName": "Heaven, If You Are Not Here on Earth (Poem)",
        "notes": ""
    },
    {
        "id": "19qlOXD22HRgkiB9uUaGVlnT41Ad9l7Xr",
        "linkText": "Chapter-11",
        "pdfUrl": "https://drive.google.com/file/d/19qlOXD22HRgkiB9uUaGVlnT41Ad9l7Xr/view?usp=sharing",
        "fileId": "19qlOXD22HRgkiB9uUaGVlnT41Ad9l7Xr",
        "subject": "English",
        "resourceType": "chapter_notes",
        "chapterName": "Japan and Brazil Through A Traveller's Eye (Travelogue)",
        "notes": ""
    },
    {
        "id": "1axbERf_d8uZblYbBTX6kXiikwwXw2JOI",
        "linkText": "Chapter-12",
        "pdfUrl": "https://drive.google.com/file/d/1axbERf_d8uZblYbBTX6kXiikwwXw2JOI/view?usp=sharing",
        "fileId": "1axbERf_d8uZblYbBTX6kXiikwwXw2JOI",
        "subject": "English",
        "resourceType": "chapter_notes",
        "chapterName": "The Voter (Story)",
        "notes": ""
    },
    {
        "id": "1EUMWuZZJA09e4eD_7g9LQYQFVgikaQ2Y",
        "linkText": "Chapter-13",
        "pdfUrl": "https://drive.google.com/file/d/1EUMWuZZJA09e4eD_7g9LQYQFVgikaQ2Y/view?usp=sharing",
        "fileId": "1EUMWuZZJA09e4eD_7g9LQYQFVgikaQ2Y",
        "subject": "English",
        "resourceType": "chapter_notes",
        "chapterName": "Where There is a Wheel (Essay)",
        "notes": ""
    },
    {
        "id": "1J1nJGueLN2G22ImrI4ecj0z6rQJ62K8Z",
        "linkText": "Chapter-14",
        "pdfUrl": "https://drive.google.com/file/d/1J1nJGueLN2G22ImrI4ecj0z6rQJ62K8Z/view?usp=sharing",
        "fileId": "1J1nJGueLN2G22ImrI4ecj0z6rQJ62K8Z",
        "subject": "English",
        "resourceType": "chapter_notes",
        "chapterName": "Water (Poem)",
        "notes": ""
    }
]


def migrate():
    # --- 1. Update resources.json ---
    with open(RESOURCES_PATH, "r", encoding="utf-8") as f:
        resources = json.load(f)

    old_key = "2nd-pu-notes-english"
    archive_key = "2nd-pu-notes-english-archive"

    if old_key not in resources:
        print(f"ERROR: Key '{old_key}' not found in resources.json")
        return

    # Save old entries to archive
    old_entries = resources[old_key]
    print(f"Found {len(old_entries)} old entries under '{old_key}'")

    # Create archive with old data
    resources[archive_key] = old_entries
    print(f"Created archive key '{archive_key}' with {len(old_entries)} entries")

    # Replace with new data
    resources[old_key] = NEW_NOTES
    print(f"Replaced '{old_key}' with {len(NEW_NOTES)} new entries")

    # Write back
    with open(RESOURCES_PATH, "w", encoding="utf-8") as f:
        json.dump(resources, f, indent=2, ensure_ascii=False)
    print(f"Saved resources.json")

    # --- 2. Update slug-registry.json ---
    with open(SLUG_REGISTRY_PATH, "r", encoding="utf-8") as f:
        registry = json.load(f)

    if archive_key not in registry:
        registry[archive_key] = {
            "type": "subject",
            "entityId": "2nd-pu-english",
            "subType": "notes-archive"
        }
        with open(SLUG_REGISTRY_PATH, "w", encoding="utf-8") as f:
            json.dump(registry, f, indent=2, ensure_ascii=False)
        print(f"Added '{archive_key}' to slug-registry.json")
    else:
        print(f"'{archive_key}' already exists in slug-registry.json")

    print("\n✅ Migration complete!")
    print(f"   - Old notes archived under: /{archive_key}")
    print(f"   - New notes live under: /{old_key}")


if __name__ == "__main__":
    migrate()
