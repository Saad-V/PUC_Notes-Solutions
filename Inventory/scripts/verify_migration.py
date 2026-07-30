import json

with open("Inventory/content/resources.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print("2nd-pu-notes-english exists:", "2nd-pu-notes-english" in data)
print("2nd-pu-notes-english-archive exists:", "2nd-pu-notes-english-archive" in data)

notes = data.get("2nd-pu-notes-english", [])
archive = data.get("2nd-pu-notes-english-archive", [])
print(f"New notes count: {len(notes)}")
print(f"Archive count: {len(archive)}")

if notes:
    print(f"First new note ID: {notes[0]['id']}")
    print(f"First new note chapter: {notes[0].get('chapterName', 'N/A')}")
if archive:
    print(f"First archive ID: {archive[0]['id']}")
