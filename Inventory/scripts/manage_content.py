#!/usr/bin/env python3
"""
manage_content.py — Admin Content & URL Management CLI Tool for PUC Notes

Usage:
  Interactive Mode:
    python Inventory/scripts/manage_content.py
    npm run admin

  Command Line Flags:
    Add a Resource:
      python Inventory/scripts/manage_content.py add --slug 2nd-puc-physics --title "2026 Model Paper 1" --url "https://drive.google.com/file/d/XYZ/view" --type model_paper --subject Physics

    Update Page SEO / Title:
      python Inventory/scripts/manage_content.py meta --slug about --title "About PUC Notes" --description "Free study resources for 1st, 2nd PUC & 10th Standard."

    List Resources for a Page:
      python Inventory/scripts/manage_content.py list --slug 2nd-puc-physics

    Rebuild / Sync Data:
      python Inventory/scripts/manage_content.py sync
"""

import argparse
import csv
import hashlib
import json
import os
import re
import subprocess
import sys
from urllib.parse import urlparse

# Configure stdout encoding for Windows compatibility
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONTENT_DIR = os.path.join(BASE_DIR, '..', 'content')

RESOURCES_JSON = os.path.join(CONTENT_DIR, 'resources.json')
METADATA_JSON = os.path.join(CONTENT_DIR, 'metadata.json')
SLUG_REGISTRY_JSON = os.path.join(CONTENT_DIR, 'slug-registry.json')
CSV_ENRICHED = os.path.join(CONTENT_DIR, 'pdf_inventory_enriched.csv')
CSV_SEO = os.path.join(CONTENT_DIR, 'seo_metadata.csv')
GENERATE_DATA_SCRIPT = os.path.join(BASE_DIR, 'generate_data.py')

RESOURCE_TYPES = [
    ("chapter_notes", "Chapter-wise Notes"),
    ("model_paper", "Model Papers"),
    ("solved_paper", "Solved Papers"),
    ("previous_year_paper", "Previous Year Papers"),
    ("question_bank", "Question Bank"),
    ("textbook", "Textbook"),
    ("revision_notes", "Revision Notes"),
    ("short_notes", "Exclusive Short Notes"),
    ("ncert_solutions", "NCERT Solutions"),
    ("mid_term_paper", "Mid-Term Papers"),
    ("unknown", "Other / General Resource"),
]

def extract_file_id(url: str) -> str:
    """Extract Google Drive file ID or generate a deterministic fallback ID."""
    m1 = re.search(r"/file/d/([^/]+)", url)
    if m1:
        return m1.group(1)
    m2 = re.search(r"[?&]id=([^&]+)", url)
    if m2:
        return m2.group(1)
    # Fallback to hash of URL
    return hashlib.md5(url.encode('utf-8')).hexdigest()[:16]

def infer_subject(slug: str) -> str:
    slug_lower = slug.lower()
    subjects = [
        "physics", "chemistry", "mathematics", "biology", "computer-science",
        "electronics", "statistics", "history", "accountancy", "economics",
        "business-studies", "english", "hindi", "kannada"
    ]
    for s in subjects:
        if s in slug_lower:
            return s.replace("-", " ").title()
    return ""

def load_json(filepath: str) -> dict:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_json(filepath: str, data: dict):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def run_generate_data():
    """Sync all JSON files using generate_data.py."""
    if os.path.exists(GENERATE_DATA_SCRIPT):
        print("[SYNC] Syncing dataset schemas via generate_data.py...")
        res = subprocess.run([sys.executable, GENERATE_DATA_SCRIPT], capture_output=True, text=True)
        if res.returncode == 0:
            print("[OK] Data files successfully regenerated and synchronized!")
        else:
            print(f"[WARN] Sync warning: {res.stderr or res.stdout}")

def add_resource(slug: str, title: str, pdf_url: str, resource_type: str = "model_paper", subject: str = "", chapter_name: str = "", notes: str = "", run_sync: bool = True):
    slug = slug.strip().lstrip('/')
    if not slug:
        print("[ERROR] Page Slug cannot be empty.")
        return False

    # Auto-resolve slug to notesSlug for chapter_notes, or paperSlug for exam papers
    subjects_map = load_json(os.path.join(CONTENT_DIR, 'subjects.json'))
    for subj in subjects_map.values():
        if resource_type == "chapter_notes" and subj.get('paperSlug') == slug:
            slug = subj.get('notesSlug', slug)
            break
        elif resource_type in ("model_paper", "solved_paper", "previous_year_paper", "question_bank") and subj.get('notesSlug') == slug:
            slug = subj.get('paperSlug', slug)
            break

    file_id = extract_file_id(pdf_url)
    if not subject:
        subject = infer_subject(slug)

    # 1. Update CSV (pdf_inventory_enriched.csv)
    rows = []
    headers = ["page_url", "page_slug", "pdf_url", "file_id", "subject", "page_type", "resource_type", "link_text", "chapter_name", "notes"]
    
    if os.path.exists(CSV_ENRICHED):
        with open(CSV_ENRICHED, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            rows = list(reader)

    page_url = f"https://www.pucnotes-solutions.com/{slug}"
    page_type = "notes_page" if "notes" in slug else "resource_page"

    new_row = {
        "page_url": page_url,
        "page_slug": slug,
        "pdf_url": pdf_url,
        "file_id": file_id,
        "subject": subject,
        "page_type": page_type,
        "resource_type": resource_type,
        "link_text": title,
        "chapter_name": chapter_name,
        "notes": notes
    }

    rows.append(new_row)

    with open(CSV_ENRICHED, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        writer.writerows(rows)

    # 2. Update resources.json directly for immediate availability
    resources_map = load_json(RESOURCES_JSON)
    if slug not in resources_map:
        resources_map[slug] = []

    new_entry = {
        "id": file_id,
        "linkText": title,
        "pdfUrl": pdf_url,
        "fileId": file_id,
        "subject": subject,
        "resourceType": resource_type,
        "chapterName": chapter_name,
        "notes": notes
    }

    resources_map[slug].append(new_entry)
    save_json(RESOURCES_JSON, resources_map)

    print(f"[SUCCESS] Resource added to /{slug}")
    print(f"   * Title: {title}")
    print(f"   * Type: {resource_type}")
    print(f"   * URL: {pdf_url}")

    if run_sync:
        run_generate_data()

    return True

def update_metadata(slug: str, title: str, description: str, run_sync: bool = True):
    slug = slug.strip().lstrip('/')
    if not slug:
        slug = '/'

    # 1. Update CSV (seo_metadata.csv)
    metadata_rows = {}
    if os.path.exists(CSV_SEO):
        with open(CSV_SEO, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                metadata_rows[row['url'].strip()] = row

    page_url = '/' if slug == '/' else f"https://www.pucnotes-solutions.com/{slug}"
    metadata_rows[page_url] = {
        "url": page_url,
        "title": title,
        "description": description
    }

    with open(CSV_SEO, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=["url", "title", "description"])
        writer.writeheader()
        writer.writerows(metadata_rows.values())

    # 2. Update metadata.json
    meta_json = load_json(METADATA_JSON)
    meta_json[slug] = {
        "title": title,
        "description": description
    }
    save_json(METADATA_JSON, meta_json)

    print(f"[OK] Metadata updated for '{slug}'")
    print(f"   * Title: {title}")
    print(f"   * Description: {description}")

    if run_sync:
        run_generate_data()

def list_resources_for_slug(slug: str):
    resources_map = load_json(RESOURCES_JSON)
    subjects_map = load_json(os.path.join(CONTENT_DIR, 'subjects.json'))
    slug = slug.strip().lstrip('/')

    # Check if this slug is a paperSlug or notesSlug of a subject
    partner_slug = None
    for subj in subjects_map.values():
        if subj.get('paperSlug') == slug:
            partner_slug = subj.get('notesSlug')
            break
        elif subj.get('notesSlug') == slug:
            partner_slug = subj.get('paperSlug')
            break

    items = resources_map.get(slug, [])
    print(f"\n[FILES] Resources registered for '/{slug}' ({len(items)} items):")
    print("=" * 70)
    if items:
        for idx, item in enumerate(items, 1):
            print(f"{idx}. [{item.get('resourceType', 'unknown')}] {item.get('linkText')}")
            print(f"   ID: {item.get('fileId')} | URL: {item.get('pdfUrl')}")
    else:
        print(f"No resources directly registered for '/{slug}'")
    print("=" * 70)

    if partner_slug:
        partner_items = resources_map.get(partner_slug, [])
        print(f"\n💡 Related Subject Notes/Papers Slug: '/{partner_slug}' ({len(partner_items)} items):")
        print("-" * 70)
        if partner_items:
            for idx, item in enumerate(partner_items, 1):
                print(f"{idx}. [{item.get('resourceType', 'unknown')}] {item.get('linkText')}")
                print(f"   ID: {item.get('fileId')} | URL: {item.get('pdfUrl')}")
        else:
            print(f"No resources currently found under '/{partner_slug}'")
        print("-" * 70)

def delete_resource(slug: str, item_id: str):
    slug = slug.strip().lstrip('/')
    item_id = item_id.strip()

    # 1. Remove from CSV (pdf_inventory_enriched.csv) so generate_data.py doesn't re-create it
    removed_csv = False
    if os.path.exists(CSV_ENRICHED):
        rows = []
        headers = ["page_url", "page_slug", "pdf_url", "file_id", "subject", "page_type", "resource_type", "link_text", "chapter_name", "notes"]
        with open(CSV_ENRICHED, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            if reader.fieldnames:
                headers = reader.fieldnames
            for row in reader:
                if row.get('file_id') == item_id or extract_file_id(row.get('pdf_url', '')) == item_id:
                    removed_csv = True
                else:
                    rows.append(row)

        if removed_csv:
            with open(CSV_ENRICHED, 'w', encoding='utf-8', newline='') as f:
                writer = csv.DictWriter(f, fieldnames=headers)
                writer.writeheader()
                writer.writerows(rows)
            print(f"[OK] Removed resource ID '{item_id}' from CSV source.")

    # 2. Remove from resources.json
    resources_map = load_json(RESOURCES_JSON)
    deleted_json = False
    for k, resource_list in list(resources_map.items()):
        orig_len = len(resource_list)
        new_list = [r for r in resource_list if r.get('fileId') != item_id and r.get('id') != item_id]
        if len(new_list) < orig_len:
            resources_map[k] = new_list
            deleted_json = True

    if deleted_json:
        save_json(RESOURCES_JSON, resources_map)
        print(f"[OK] Removed resource ID '{item_id}' from resources.json.")

    if not removed_csv and not deleted_json:
        print(f"[WARN] Resource ID '{item_id}' was not found in CSV or JSON.")
        return

    # 3. Sync data files permanently
    run_generate_data()

def interactive_menu():
    while True:
        print("\n" + "=" * 60)
        print("      PUC NOTES & SOLUTIONS -- ADMIN CONTENT MANAGEMENT")
        print("=" * 60)
        print(" [1] Add New PDF Resource / URL to a Page")
        print(" [2] Update Page Title & SEO Description")
        print(" [3] List Resources for a Page Slug")
        print(" [4] Delete a Resource")
        print(" [5] Rebuild / Sync Site Data Files")
        print(" [0] Exit")
        print("=" * 60)
        choice = input("Select an option (0-5): ").strip()

        if choice == "1":
            print("\n[+] Add New Resource")
            slug = input("Enter Page Slug (e.g. 2nd-puc-physics, 1st-puc-chemistry, kcet-mock-papers): ").strip()
            title = input("Enter Resource Title (e.g. 2026 Model Paper 1 Solved): ").strip()
            pdf_url = input("Enter PDF / Resource URL: ").strip()

            print("\nSelect Resource Type:")
            for i, (type_key, type_label) in enumerate(RESOURCE_TYPES, 1):
                print(f"  {i}. {type_label} ({type_key})")
            type_choice = input(f"Select type (1-{len(RESOURCE_TYPES)}) [Default: 2 (model_paper)]: ").strip()
            
            resource_type = "model_paper"
            if type_choice.isdigit() and 1 <= int(type_choice) <= len(RESOURCE_TYPES):
                resource_type = RESOURCE_TYPES[int(type_choice) - 1][0]

            subject = input(f"Subject name (leave blank to infer from '{slug}'): ").strip()
            chapter_name = input("Chapter Name (optional): ").strip()
            
            add_resource(slug, title, pdf_url, resource_type, subject, chapter_name)

        elif choice == "2":
            print("\n[*] Update Page Metadata")
            slug = input("Enter Page Slug (e.g. about, 2nd-puc-physics, kcet): ").strip()
            title = input("Enter SEO Title: ").strip()
            description = input("Enter Meta Description: ").strip()
            update_metadata(slug, title, description)

        elif choice == "3":
            print("\n[*] List Resources")
            slug = input("Enter Page Slug: ").strip()
            list_resources_for_slug(slug)

        elif choice == "4":
            print("\n[-] Delete Resource")
            slug = input("Enter Page Slug: ").strip()
            list_resources_for_slug(slug)
            item_id = input("Enter File ID to delete: ").strip()
            if item_id:
                delete_resource(slug, item_id)

        elif choice == "5":
            run_generate_data()

        elif choice == "0":
            print("Goodbye!")
            break
        else:
            print("Invalid selection. Try again.")

def main():
    parser = argparse.ArgumentParser(description="Admin Content & URL Manager for PUC Notes")
    subparsers = parser.add_subparsers(dest="command", help="Available subcommands")

    # 'add' command
    add_parser = subparsers.add_parser("add", help="Add a new PDF resource")
    add_parser.add_argument("--slug", required=True, help="Target page slug (e.g., 2nd-puc-physics)")
    add_parser.add_argument("--title", required=True, help="Resource title / link text")
    add_parser.add_argument("--url", required=True, help="PDF or Resource URL")
    add_parser.add_argument("--type", default="model_paper", help="Resource type (e.g. model_paper, chapter_notes, question_bank)")
    add_parser.add_argument("--subject", default="", help="Subject name")
    add_parser.add_argument("--chapter", default="", help="Chapter name (optional)")

    # 'meta' command
    meta_parser = subparsers.add_parser("meta", help="Update SEO Title and Meta Description")
    meta_parser.add_argument("--slug", required=True, help="Target page slug")
    meta_parser.add_argument("--title", required=True, help="Page Title")
    meta_parser.add_argument("--description", required=True, help="Meta Description")

    # 'list' command
    list_parser = subparsers.add_parser("list", help="List resources for a page slug")
    list_parser.add_argument("--slug", required=True, help="Target page slug")

    # 'delete' command
    delete_parser = subparsers.add_parser("delete", help="Delete a resource by file ID")
    delete_parser.add_argument("--slug", required=True, help="Target page slug")
    delete_parser.add_argument("--item-id", required=True, help="File ID or resource ID to delete")

    # 'sync' command
    subparsers.add_parser("sync", help="Sync data JSON schemas")

    args = parser.parse_args()

    if args.command == "add":
        add_resource(args.slug, args.title, args.url, args.type, args.subject, args.chapter)
    elif args.command == "meta":
        update_metadata(args.slug, args.title, args.description)
    elif args.command == "list":
        list_resources_for_slug(args.slug)
    elif args.command == "delete":
        delete_resource(args.slug, args.item_id)
    elif args.command == "sync":
        run_generate_data()
    else:
        interactive_menu()

if __name__ == "__main__":
    main()
