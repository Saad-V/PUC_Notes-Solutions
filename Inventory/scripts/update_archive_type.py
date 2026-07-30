import json

RESOURCES_PATH = "Inventory/content/resources.json"

with open(RESOURCES_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

archive_key = "2nd-pu-notes-english-archive"
if archive_key in data:
    for entry in data[archive_key]:
        entry["resourceType"] = "old_notes"
    print(f"Updated {len(data[archive_key])} entries to resourceType='old_notes'")

    with open(RESOURCES_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("Saved resources.json")
else:
    print(f"Key '{archive_key}' not found!")
