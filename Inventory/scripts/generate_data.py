"""
generate_data.py — Comprehensive data generation for PUC Notes & Solutions

Reads from:
  - seo_metadata.csv      (106 URL → title/description mappings)
  - pdf_inventory_enriched.csv  (890 PDF resources)
  - all_urls.csv           (completeness check)

Produces:
  - classes.json           (4 top-level classes)
  - streams.json           (stream combinations per class)
  - subjects.json          (individual subjects)
  - resources.json         (PDF resources keyed by page slug)
  - slug-registry.json     (maps every slug → page type + entity reference)
  - metadata.json          (slug → SEO title/description)
"""

import csv
import json
import os
import sys

CONTENT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'content')

# ──────────────────────────────────────────────
# 1. HARDCODED HIERARCHY (these are facts about the educational system)
# ──────────────────────────────────────────────

CLASSES = {
    "1st-pu": {
        "id": "1st-pu",
        "name": "1st PUC",
        "slug": "1stpuckarnataka",
        "board": "DPUE",
        "order": 2,
        "streams": ["1st-pu-science", "1st-pu-commerce", "1st-pu-languages"]
    },
    "2nd-pu": {
        "id": "2nd-pu",
        "name": "2nd PUC",
        "slug": "2ndpuckarnataka",
        "board": "DPUE",
        "order": 3,
        "streams": ["2nd-pu-science", "2nd-pu-commerce", "2nd-pu-languages"]
    },
    "10th": {
        "id": "10th",
        "name": "10th Standard",
        "slug": "10thkseebresources",
        "board": "KSEEB",
        "order": 1,
        "streams": []
    },
    "kcet": {
        "id": "kcet",
        "name": "KCET",
        "slug": "kcet",
        "board": "KEA",
        "order": 4,
        "streams": []
    }
}

STREAMS = {
    # ── 1st PU ──
    "1st-pu-science": {
        "id": "1st-pu-science",
        "classId": "1st-pu",
        "name": "Science",
        "slugs": [
            "1st-puc-science-pcmb-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf",
            "1st-puc-science-pcmc-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf",
            "1st-puc-science-pcme-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf",
            "1st-puc-science-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf",
        ],
        "subjects": [
            "1st-pu-physics", "1st-pu-chemistry", "1st-pu-mathematics",
            "1st-pu-biology", "1st-pu-computer-science", "1st-pu-electronics",
            "1st-pu-statistics"
        ]
    },
    "1st-pu-commerce": {
        "id": "1st-pu-commerce",
        "classId": "1st-pu",
        "name": "Commerce",
        "slugs": [
            "1st-puc-commerce-seba-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf",
            "1st-puc-commerce-heba-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf",
            "1st-puc-commerce-ceba-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf",
            "1st-puc-commerce-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf",
        ],
        "subjects": [
            "1st-pu-accountancy", "1st-pu-business-studies", "1st-pu-economics",
            "1st-pu-history", "1st-pu-statistics"
        ]
    },
    "1st-pu-languages": {
        "id": "1st-pu-languages",
        "classId": "1st-pu",
        "name": "Languages",
        "slugs": [
            "1st-puc-languages-hindi-english-kannada-notes-model-question-solved-papers-download-pdf",
        ],
        "subjects": [
            "1st-pu-english", "1st-pu-hindi", "1st-pu-kannada"
        ]
    },
    # ── 2nd PU ──
    "2nd-pu-science": {
        "id": "2nd-pu-science",
        "classId": "2nd-pu",
        "name": "Science",
        "slugs": [
            "2nd-puc-science-pcmb-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf",
            "2nd-puc-science-pcmc-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf",
            "2nd-puc-science-pcme-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf",
            "2nd-puc-science-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf",
        ],
        "subjects": [
            "2nd-pu-physics", "2nd-pu-chemistry", "2nd-pu-mathematics",
            "2nd-pu-biology", "2nd-pu-computer-science", "2nd-pu-electronics",
            "2nd-pu-statistics"
        ]
    },
    "2nd-pu-commerce": {
        "id": "2nd-pu-commerce",
        "classId": "2nd-pu",
        "name": "Commerce",
        "slugs": [
            "2nd-puc-commerce-seba-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf",
            "2nd-puc-commerce-heba-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf",
            "2nd-puc-commerce-ceba-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf",
            "2nd-puc-commerce-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf",
        ],
        "subjects": [
            "2nd-pu-accountancy", "2nd-pu-business-studies", "2nd-pu-economics",
            "2nd-pu-history", "2nd-pu-statistics"
        ]
    },
    "2nd-pu-languages": {
        "id": "2nd-pu-languages",
        "classId": "2nd-pu",
        "name": "Languages",
        "slugs": [
            "2nd-puc-languages-hindi-english-kannada-notes-model-question-solved-papers-download-pdf",
        ],
        "subjects": [
            "2nd-pu-english", "2nd-pu-hindi", "2nd-pu-kannada"
        ]
    },
}

# Subject definitions: id → { name, classId, streamId, paperSlug, notesSlug }
# paperSlug = the page with model papers / question banks / solved papers
# notesSlug = the page with chapter-wise notes
SUBJECTS = {
    # ── 1st PU Science ──
    "1st-pu-physics":          {"name": "Physics",          "classId": "1st-pu", "streamId": "1st-pu-science",   "paperSlug": "1st-puc-physics",          "notesSlug": "1st-pu-notes-physics"},
    "1st-pu-chemistry":        {"name": "Chemistry",        "classId": "1st-pu", "streamId": "1st-pu-science",   "paperSlug": "1st-puc-chemistry",        "notesSlug": "1st-pu-notes-chemistry"},
    "1st-pu-mathematics":      {"name": "Mathematics",      "classId": "1st-pu", "streamId": "1st-pu-science",   "paperSlug": "1st-puc-mathematics",      "notesSlug": "1st-pu-notes-mathematics"},
    "1st-pu-biology":          {"name": "Biology",          "classId": "1st-pu", "streamId": "1st-pu-science",   "paperSlug": "1st-puc-biology",          "notesSlug": "1st-pu-notes-biology"},
    "1st-pu-computer-science": {"name": "Computer Science", "classId": "1st-pu", "streamId": "1st-pu-science",   "paperSlug": "1st-puc-computer-science", "notesSlug": "1st-pu-notes-computer-science"},
    "1st-pu-electronics":      {"name": "Electronics",      "classId": "1st-pu", "streamId": "1st-pu-science",   "paperSlug": "1st-puc-electronics",      "notesSlug": "1st-pu-notes-electronics"},
    # ── 1st PU Commerce ──
    "1st-pu-accountancy":      {"name": "Accountancy",      "classId": "1st-pu", "streamId": "1st-pu-commerce",  "paperSlug": "1st-puc-accountancy-content", "notesSlug": "1st-pu-accountancy-notes"},
    "1st-pu-business-studies": {"name": "Business Studies", "classId": "1st-pu", "streamId": "1st-pu-commerce",  "paperSlug": "1st-puc-business-studies", "notesSlug": "1st-pu-notes-business-studies"},
    "1st-pu-economics":        {"name": "Economics",        "classId": "1st-pu", "streamId": "1st-pu-commerce",  "paperSlug": "1st-puc-economic",         "notesSlug": "1st-pu-notes-economics"},
    "1st-pu-history":          {"name": "History",          "classId": "1st-pu", "streamId": "1st-pu-commerce",  "paperSlug": "1st-puc-history",          "notesSlug": "1st-pu-notes-history"},
    # ── 1st PU Languages ──
    "1st-pu-english":          {"name": "English",          "classId": "1st-pu", "streamId": "1st-pu-languages", "paperSlug": "1st-puc-english",          "notesSlug": "1st-pu-notes-english"},
    "1st-pu-hindi":            {"name": "Hindi",            "classId": "1st-pu", "streamId": "1st-pu-languages", "paperSlug": "1st-puc-hindi",            "notesSlug": "1st-pu-notes-hindi"},
    "1st-pu-kannada":          {"name": "Kannada",          "classId": "1st-pu", "streamId": "1st-pu-languages", "paperSlug": "1st-puc-kannada",          "notesSlug": "1st-pu-notes-kannada"},
    # ── 1st PU Statistics (shared between Science & Commerce) ──
    "1st-pu-statistics":       {"name": "Statistics",       "classId": "1st-pu", "streamId": "1st-pu-science",   "paperSlug": "1st-puc-statistics",       "notesSlug": "1st-pu-notes-statistics"},

    # ── 2nd PU Science ──
    "2nd-pu-physics":          {"name": "Physics",          "classId": "2nd-pu", "streamId": "2nd-pu-science",   "paperSlug": "2nd-puc-physics",          "notesSlug": "2nd-pu-notes-physics"},
    "2nd-pu-chemistry":        {"name": "Chemistry",        "classId": "2nd-pu", "streamId": "2nd-pu-science",   "paperSlug": "2nd-puc-chemistry",        "notesSlug": "2nd-pu-notes-chemistry"},
    "2nd-pu-mathematics":      {"name": "Mathematics",      "classId": "2nd-pu", "streamId": "2nd-pu-science",   "paperSlug": "2nd-puc-mathematics",      "notesSlug": "2nd-pu-notes-mathematics"},
    "2nd-pu-biology":          {"name": "Biology",          "classId": "2nd-pu", "streamId": "2nd-pu-science",   "paperSlug": "2nd-puc-biology",          "notesSlug": "2nd-pu-notes-biology"},
    "2nd-pu-computer-science": {"name": "Computer Science", "classId": "2nd-pu", "streamId": "2nd-pu-science",   "paperSlug": "2nd-puc-computer-science", "notesSlug": "2nd-pu-notes-computer-science"},
    "2nd-pu-electronics":      {"name": "Electronics",      "classId": "2nd-pu", "streamId": "2nd-pu-science",   "paperSlug": "2nd-puc-electronics",      "notesSlug": "2nd-pu-notes-electronics"},
    # ── 2nd PU Commerce ──
    "2nd-pu-accountancy":      {"name": "Accountancy",      "classId": "2nd-pu", "streamId": "2nd-pu-commerce",  "paperSlug": "2nd-puc-accountancy",      "notesSlug": "2nd-pu-notes-accountancy"},
    "2nd-pu-business-studies": {"name": "Business Studies", "classId": "2nd-pu", "streamId": "2nd-pu-commerce",  "paperSlug": "2nd-puc-business-studies", "notesSlug": "2nd-pu-notes-business-studies"},
    "2nd-pu-economics":        {"name": "Economics",        "classId": "2nd-pu", "streamId": "2nd-pu-commerce",  "paperSlug": "2nd-puc-economics",        "notesSlug": "2nd-pu-notes-economics"},
    "2nd-pu-history":          {"name": "History",          "classId": "2nd-pu", "streamId": "2nd-pu-commerce",  "paperSlug": "2nd-puc-history",          "notesSlug": "2nd-pu-notes-history"},
    # ── 2nd PU Languages ──
    "2nd-pu-english":          {"name": "English",          "classId": "2nd-pu", "streamId": "2nd-pu-languages", "paperSlug": "2nd-puc-english",          "notesSlug": "2nd-pu-notes-english"},
    "2nd-pu-hindi":            {"name": "Hindi",            "classId": "2nd-pu", "streamId": "2nd-pu-languages", "paperSlug": "2nd-puc-hindi",            "notesSlug": "2nd-pu-notes-hindi"},
    "2nd-pu-kannada":          {"name": "Kannada",          "classId": "2nd-pu", "streamId": "2nd-pu-languages", "paperSlug": "2nd-puc-kannada",          "notesSlug": "2nd-pu-notes-kannada"},
    # ── 2nd PU Statistics (shared between Science & Commerce) ──
    "2nd-pu-statistics":       {"name": "Statistics",       "classId": "2nd-pu", "streamId": "2nd-pu-science",   "paperSlug": "2nd-puc-statistics",       "notesSlug": "2nd-pu-notes-statistics"},
}

# Resource-aggregate pages (cross-cutting, not tied to a single subject)
RESOURCE_AGGREGATE_SLUGS = {
    "question-bank":           {"resourceType": "question_bank",        "name": "Question Bank"},
    "model-papers":            {"resourceType": "model_paper",          "name": "Model Papers"},
    "previous-year-papers":    {"resourceType": "previous_year_paper",  "name": "Previous Year Papers"},
    "revision-notes":          {"resourceType": "revision_notes",       "name": "Revision Notes"},
    "solved-papers":           {"resourceType": "solved_paper",         "name": "Solved Papers"},
    "mid-term-papers":         {"resourceType": "mid_term_paper",       "name": "Mid-Term Papers"},
    "exclusive-short-notes":   {"resourceType": "short_notes",          "name": "Exclusive Short Notes"},
    "ncert-textbook-solutions":{"resourceType": "ncert_solutions",      "name": "NCERT Textbook Solutions"},
    "textbooksdownload":       {"resourceType": "textbook",             "name": "Textbooks Download"},
    "1stpuctextbookdownload":  {"resourceType": "textbook",             "name": "1st PUC Textbooks", "classId": "1st-pu"},
    "2ndpuctextbookdownload":  {"resourceType": "textbook",             "name": "2nd PUC Textbooks", "classId": "2nd-pu"},
    "10th-textbookspdfdownload":{"resourceType": "textbook",            "name": "10th Textbooks",    "classId": "10th"},
}

# KCET sub-pages
KCET_SLUGS = {
    "kcet-pattern":        {"name": "KCET Pattern",        "subType": "info"},
    "kcet-cutoffs":        {"name": "KCET Cutoffs",        "subType": "info"},
    "kcet-latest-news":    {"name": "KCET Latest News",    "subType": "info"},
    "kcet-mock-papers":    {"name": "KCET Mock Papers",    "subType": "resource"},
    "kcet-question-bank":  {"name": "KCET Question Bank",  "subType": "resource"},
    "kcet-question-papers":{"name": "KCET Question Papers","subType": "resource"},
    "kcet-revision-notes": {"name": "KCET Revision Notes", "subType": "resource"},
    "kcet-solved-papers":  {"name": "KCET Solved Papers",  "subType": "resource"},
}

STATIC_SLUGS = ["about", "contact", "privacy-policy", "terms-conditions", "content-updates", "menu"]


def read_seo_metadata():
    """Parse seo_metadata.csv → dict[slug, {title, description}]"""
    metadata = {}
    filepath = os.path.join(CONTENT_DIR, 'seo_metadata.csv')
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            url = row['url'].strip()
            if not url:
                continue
            parts = url.rstrip('/').split('/')
            slug = parts[-1] if parts[-1] else ''
            # Homepage
            if slug == 'www.pucnotes-solutions.com' or slug == '' or url.endswith('.com'):
                slug = '/'
            metadata[slug] = {
                'title': row.get('title', '').strip(),
                'description': row.get('description', '').strip()
            }
    return metadata


def read_resources():
    """Parse pdf_inventory_enriched.csv → list of resource dicts"""
    resources = []
    filepath = os.path.join(CONTENT_DIR, 'pdf_inventory_enriched.csv')
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            resources.append({
                'pageSlug': row['page_slug'].strip(),
                'linkText': row['link_text'].strip(),
                'pdfUrl': row['pdf_url'].strip(),
                'fileId': row['file_id'].strip(),
                'subject': row['subject'].strip(),
                'pageType': row['page_type'].strip(),
                'resourceType': row['resource_type'].strip(),
                'chapterName': row.get('chapter_name', '').strip(),
                'notes': row.get('notes', '').strip(),
            })
    return resources


def read_all_urls():
    """Parse all_urls.csv → set of slugs"""
    slugs = set()
    filepath = os.path.join(CONTENT_DIR, 'all_urls.csv')
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            url = row['url'].strip()
            if not url:
                continue
            parts = url.rstrip('/').split('/')
            slug = parts[-1] if parts[-1] else ''
            if slug == 'www.pucnotes-solutions.com' or slug == '' or url.endswith('.com'):
                continue  # homepage, handled separately
            slugs.add(slug)
    return slugs


def build_slug_registry(metadata):
    """Build the slug-registry mapping every slug to its page type."""
    registry = {}

    # 1. Class pages
    for cls in CLASSES.values():
        registry[cls['slug']] = {"type": "class", "entityId": cls['id']}

    # 2. Stream pages
    for stream in STREAMS.values():
        for slug in stream['slugs']:
            registry[slug] = {"type": "stream", "entityId": stream['id']}

    # 3. Subject pages (papers + notes)
    for subj_id, subj in SUBJECTS.items():
        if subj['paperSlug']:
            registry[subj['paperSlug']] = {"type": "subject", "entityId": subj_id, "subType": "papers"}
        if subj['notesSlug']:
            registry[subj['notesSlug']] = {"type": "subject", "entityId": subj_id, "subType": "notes"}

    # 4. Resource aggregate pages
    for slug, info in RESOURCE_AGGREGATE_SLUGS.items():
        entry = {"type": "resource-aggregate", "resourceType": info['resourceType']}
        if 'classId' in info:
            entry['classId'] = info['classId']
        registry[slug] = entry

    # 5. KCET sub-pages
    for slug, info in KCET_SLUGS.items():
        registry[slug] = {"type": "kcet-subpage", "entityId": "kcet", "subType": info['subType']}

    # 6. Static pages
    for slug in STATIC_SLUGS:
        registry[slug] = {"type": "static"}

    return registry


def build_resources_by_slug(raw_resources):
    """Group resources by their page slug."""
    by_slug = {}
    for r in raw_resources:
        slug = r['pageSlug']
        if not slug:
            continue
        if slug not in by_slug:
            by_slug[slug] = []
        by_slug[slug].append({
            'id': r['fileId'],
            'linkText': r['linkText'],
            'pdfUrl': r['pdfUrl'],
            'fileId': r['fileId'],
            'subject': r['subject'],
            'resourceType': r['resourceType'],
            'chapterName': r['chapterName'],
            'notes': r['notes'],
        })
    return by_slug


def main():
    print("Reading CSV files...")
    metadata = read_seo_metadata()
    raw_resources = read_resources()
    all_url_slugs = read_all_urls()

    print(f"  metadata.json: {len(metadata)} entries")
    print(f"  resources: {len(raw_resources)} PDF entries")
    print(f"  all_urls: {len(all_url_slugs)} slugs")

    # Build outputs
    slug_registry = build_slug_registry(metadata)
    resources_by_slug = build_resources_by_slug(raw_resources)

    # Enrich subjects with id field
    subjects_out = {}
    for subj_id, subj in SUBJECTS.items():
        subjects_out[subj_id] = {
            "id": subj_id,
            **subj
        }

    # Validate: check that every URL in all_urls.csv is in the registry
    print("\nValidation:")
    missing = []
    for slug in sorted(all_url_slugs):
        if slug not in slug_registry:
            # Check if it's the homepage or a known variant
            if slug in ('www.pucnotes-solutions.com', ''):
                continue
            missing.append(slug)
    
    if missing:
        print(f"  WARNING: {len(missing)} URLs not in slug registry:")
        for m in missing:
            print(f"    - {m}")
    else:
        print(f"  [OK] All {len(all_url_slugs)} URLs mapped in slug registry")

    # Check resource coverage
    slugs_with_resources = set(resources_by_slug.keys())
    subject_slugs = set()
    for subj in SUBJECTS.values():
        if subj['paperSlug']: subject_slugs.add(subj['paperSlug'])
        if subj['notesSlug']: subject_slugs.add(subj['notesSlug'])
    
    subject_slugs_without_resources = subject_slugs - slugs_with_resources
    if subject_slugs_without_resources:
        print(f"  INFO: {len(subject_slugs_without_resources)} subject pages have no PDF resources:")
        for s in sorted(subject_slugs_without_resources):
            print(f"    - {s}")
    
    resource_slugs_not_in_registry = slugs_with_resources - set(slug_registry.keys())
    if resource_slugs_not_in_registry:
        print(f"  WARNING: {len(resource_slugs_not_in_registry)} resource slugs not in registry:")
        for s in sorted(resource_slugs_not_in_registry):
            print(f"    - {s}")

    # Write outputs
    print("\nWriting JSON files...")

    def write_json(filename, data):
        filepath = os.path.join(CONTENT_DIR, filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"  [OK] {filename} ({len(data)} entries)")

    write_json('classes.json', CLASSES)
    write_json('streams.json', STREAMS)
    write_json('subjects.json', subjects_out)
    write_json('resources.json', resources_by_slug)
    write_json('slug-registry.json', slug_registry)
    write_json('metadata.json', metadata)

    print(f"\nTotal slugs in registry: {len(slug_registry)}")
    print("Done!")


if __name__ == '__main__':
    main()
