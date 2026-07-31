import json

with open("Inventory/content/resources.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for key in ["1st-pu-notes-english", "1st-pu-notes-english-archive"]:
    entries = data.get(key, [])
    print(f"{key}: {len(entries)} entries")
    if entries:
        print(f"  First: {entries[0]['id']} | type={entries[0]['resourceType']} | chapter={entries[0].get('chapterName','')}")
