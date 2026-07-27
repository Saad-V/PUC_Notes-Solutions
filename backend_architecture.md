# PUC Notes — Comprehensive Backend Architecture Guide

This document provides an end-to-end technical reference for the backend system, data flow, routing dispatcher, content generation pipeline, complete taxonomy of all active slugs, and step-by-step procedures for modifying, adding, or removing types in **PUC Notes & Solutions**.

---

## 1. System Overview & Architecture Philosophy

PUC Notes is built on **Next.js App Router** using **Static Site Generation (SSG)**.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ADMIN / DATA INGESTION                           │
│  csv / CLI (manage_content.py) ──> Inventory/scripts/generate_data.py   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Generates JSON Datasets
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           CONTENT STORAGE                               │
│  Inventory/content/ (classes, streams, subjects, resources, registry)   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Fast JSON Readers
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       DATA ACCESS LAYER (data.ts)                       │
│  resolveSlug(), getSubject(), getResourcesForCategory(), buildCrumbs()  │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Pre-renders 480+ Pages
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      DYNAMIC ROUTER ([...slug]/page.tsx)                │
│  ClassPage | StreamPage | SubjectPage | ResourceCategoryPage | ComingSoon│
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Principles
1. **Zero Database Latency**: All site content is pre-compiled into lightweight, structured JSON files in `Inventory/content/`. At runtime/build-time, queries are instantaneous file reads.
2. **Deterministic Static Generation**: `generateStaticParams()` reads the central `slug-registry.json` to pre-render every single route into static HTML at build time.
3. **Decoupled Admin Ingestion**: Admin actions (adding PDFs, changing titles, creating subjects) update raw CSV/JSON records via CLI, which sync to the application seamlessly.

---

## 2. Core Data Models (`src/lib/types.ts`)

The backend types are defined in `src/lib/types.ts`:

```typescript
// Top-level educational level (10th, 1st PU, 2nd PU, KCET)
export interface ClassData {
  id: string;        // e.g. "1st-pu"
  name: string;      // e.g. "1st PUC"
  slug: string;      // e.g. "1stpuckarnataka"
  board: string;     // e.g. "DPUE"
  order: number;     // e.g. 2
  streams: string[]; // List of stream IDs: ["1st-pu-science", ...]
}

// Academic branch within a class
export interface StreamData {
  id: string;        // e.g. "1st-pu-science"
  classId: string;   // e.g. "1st-pu"
  name: string;      // e.g. "Science"
  slugs: string[];   // All SEO URL variants pointing to this stream
  subjects: string[];// List of subject IDs: ["1st-pu-physics", ...]
}

// Individual subject definition
export interface SubjectData {
  id: string;        // e.g. "1st-pu-physics"
  name: string;      // e.g. "Physics"
  classId: string;   // e.g. "1st-pu"
  streamId: string;  // e.g. "1st-pu-science"
  paperSlug: string; // e.g. "1st-puc-physics" (question papers/solved papers)
  notesSlug: string; // e.g. "1st-pu-notes-physics" (chapter notes)
}

// Individual PDF/study material resource item
export interface ResourceData {
  id: string;          // Google Drive file ID or hash
  linkText: string;    // Display title (e.g., "Model Paper 1 - Solved")
  pdfUrl: string;      // Full Google Drive / PDF URL
  fileId: string;      // Unique file ID
  subject: string;     // e.g. "Physics"
  resourceType: string;// e.g. "model_paper", "chapter_notes", "question_bank"
  chapterName?: string;// Optional chapter tag
  notes?: string;      // Optional extra notes
}

// Registry dispatcher entry mapping every URL slug to its handler template
export interface SlugEntry {
  type: 'class' | 'stream' | 'subject' | 'resource-aggregate' | 'kcet-subpage' | 'static';
  entityId?: string;
  subType?: string;
  resourceType?: string;
  classId?: string;
}
```

---

## 3. Storage Layer (`Inventory/content/`)

All data lives in `Inventory/content/`:

| File | Purpose | Key / Structure |
| :--- | :--- | :--- |
| `classes.json` | Stores class hierarchy | Object keyed by `classId` (`"1st-pu"`, `"2nd-pu"`, `"10th"`, `"kcet"`) |
| `streams.json` | Stores streams per class | Object keyed by `streamId` (`"1st-pu-science"`, etc.) |
| `subjects.json` | Stores subject details & paper/notes slugs | Object keyed by `subjectId` (`"1st-pu-physics"`, etc.) |
| `resources.json` | PDF resources grouped by page slug | Object keyed by `pageSlug` → Array of `ResourceData` |
| `slug-registry.json` | Central router dispatch table | Object keyed by URL slug → `SlugEntry` |
| `metadata.json` | SEO Title & Description mappings | Object keyed by URL slug → `{ title, description }` |
| `pdf_inventory_enriched.csv` | Master CSV source for all PDFs | Tabular raw record of all PDF files |
| `seo_metadata.csv` | Master CSV source for SEO meta tags | Tabular raw record of URL titles & descriptions |

---

## 4. Complete Taxonomy & Directory of All Active Slugs

### A. Class / Course Slugs (`classes.json`)
- `10thkseebresources` ──> Class ID: `10th` (Board: KSEEB)
- `1stpuckarnataka` ──> Class ID: `1st-pu` (Board: DPUE)
- `2ndpuckarnataka` ──> Class ID: `2nd-pu` (Board: DPUE)
- `kcet` ──> Class ID: `kcet` (Board: KEA)

### B. Stream Slugs (`streams.json`)
- **1st PU Science (`1st-pu-science`)**:
  - `1st-puc-science-pcmb-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf`
  - `1st-puc-science-pcmc-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf`
  - `1st-puc-science-pcme-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf`
  - `1st-puc-science-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf`
- **1st PU Commerce (`1st-pu-commerce`)**:
  - `1st-puc-commerce-seba-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf`
  - `1st-puc-commerce-heba-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf`
  - `1st-puc-commerce-ceba-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf`
  - `1st-puc-commerce-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf`
- **1st PU Languages (`1st-pu-languages`)**:
  - `1st-puc-languages-hindi-english-kannada-notes-model-question-solved-papers-download-pdf`
- **2nd PU Science (`2nd-pu-science`)**:
  - `2nd-puc-science-pcmb-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf`
  - `2nd-puc-science-pcmc-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf`
  - `2nd-puc-science-pcme-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf`
  - `2nd-puc-science-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf`
- **2nd PU Commerce (`2nd-pu-commerce`)**:
  - `2nd-puc-commerce-seba-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf`
  - `2nd-puc-commerce-heba-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf`
  - `2nd-puc-commerce-ceba-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf`
  - `2nd-puc-commerce-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf`
- **2nd PU Languages (`2nd-pu-languages`)**:
  - `2nd-puc-languages-hindi-english-kannada-notes-model-question-solved-papers-download-pdf`

### C. Subject Slugs (`subjects.json`)
Each subject registers two URL slugs (one for exam papers/question banks, one for chapter notes):

| Subject ID | Subject Name | Paper Slug | Notes Slug |
| :--- | :--- | :--- | :--- |
| `1st-pu-physics` | Physics | `1st-puc-physics` | `1st-pu-notes-physics` |
| `1st-pu-chemistry` | Chemistry | `1st-puc-chemistry` | `1st-pu-notes-chemistry` |
| `1st-pu-mathematics` | Mathematics | `1st-puc-mathematics` | `1st-pu-notes-mathematics` |
| `1st-pu-biology` | Biology | `1st-puc-biology` | `1st-pu-notes-biology` |
| `1st-pu-computer-science` | Computer Science | `1st-puc-computer-science` | `1st-pu-notes-computer-science` |
| `1st-pu-electronics` | Electronics | `1st-puc-electronics` | `1st-pu-notes-electronics` |
| `1st-pu-statistics` | Statistics | `1st-puc-statistics` | `1st-pu-notes-statistics` |
| `1st-pu-accountancy` | Accountancy | `1st-puc-accountancy-content` | `1st-pu-accountancy-notes` |
| `1st-pu-business-studies` | Business Studies | `1st-puc-business-studies` | `1st-pu-notes-business-studies` |
| `1st-pu-economics` | Economics | `1st-puc-economic` | `1st-pu-notes-economics` |
| `1st-pu-history` | History | `1st-puc-history` | `1st-pu-notes-history` |
| `1st-pu-english` | English | `1st-puc-english` | `1st-pu-notes-english` |
| `1st-pu-hindi` | Hindi | `1st-puc-hindi` | `1st-pu-notes-hindi` |
| `1st-pu-kannada` | Kannada | `1st-puc-kannada` | `1st-pu-notes-kannada` |
| `2nd-pu-physics` | Physics | `2nd-puc-physics` | `2nd-pu-notes-physics` |
| `2nd-pu-chemistry` | Chemistry | `2nd-puc-chemistry` | `2nd-pu-notes-chemistry` |
| `2nd-pu-mathematics` | Mathematics | `2nd-puc-mathematics` | `2nd-pu-notes-mathematics` |
| `2nd-pu-biology` | Biology | `2nd-puc-biology` | `2nd-pu-notes-biology` |
| `2nd-pu-computer-science` | Computer Science | `2nd-puc-computer-science` | `2nd-pu-notes-computer-science` |
| `2nd-pu-electronics` | Electronics | `2nd-puc-electronics` | `2nd-pu-notes-electronics` |
| `2nd-pu-statistics` | Statistics | `2nd-puc-statistics` | `2nd-pu-notes-statistics` |
| `2nd-pu-accountancy` | Accountancy | `2nd-puc-accountancy` | `2nd-pu-notes-accountancy` |
| `2nd-pu-business-studies` | Business Studies | `2nd-puc-business-studies` | `2nd-pu-notes-business-studies` |
| `2nd-pu-economics` | Economics | `2nd-puc-economics` | `2nd-pu-notes-economics` |
| `2nd-pu-history` | History | `2nd-puc-history` | `2nd-pu-notes-history` |
| `2nd-pu-english` | English | `2nd-puc-english` | `2nd-pu-notes-english` |
| `2nd-pu-hindi` | Hindi | `2nd-puc-hindi` | `2nd-pu-notes-hindi` |
| `2nd-pu-kannada` | Kannada | `2nd-puc-kannada` | `2nd-pu-notes-kannada` |
| `10th-science` | Science | `10th-science-content` | `10th-science-notes` |
| `10th-mathematics` | Mathematics | `10th-mathematics-content` | `10th-mathematics-notes` |
| `10th-social-science` | Social Science | `10th-social-science-content` | `10th-social-science-notes` |
| `10th-english` | English | `10th-english-content` | `10th-english-notes` |
| `10th-kannada` | Kannada | `10th-kannada-content` | `10th-kannada-notes` |
| `10th-hindi` | Hindi | `10th-hindi-content` | `10th-hindi-notes` |

### D. 2-Segment Resource Category Slugs (`RESOURCE_TYPE_META` in `data.ts`)
2-segment routes combine a Subject Paper/Notes slug with a Category slug (e.g. `/[subjectSlug]/[categorySlug]`):

| Category Slug | Internal Key (`resourceType`) | Title |
| :--- | :--- | :--- |
| `chapter-notes` | `chapter_notes` | Chapter-wise Notes |
| `model-papers` | `model_paper` | Model Papers |
| `solved-papers` | `solved_paper` | Solved Papers |
| `previous-papers` | `previous_year_paper` | Previous Year Papers |
| `question-bank` | `question_bank` | Question Bank |
| `textbook` | `textbook` | Official Textbook |
| `revision-notes` | `revision_notes` | Revision Notes |
| `short-notes` | `short_notes` | Exclusive Short Notes |
| `ncert-solutions` | `ncert_solutions` | NCERT Solutions |
| `mid-term-papers` | `mid_term_paper` | Mid-Term Papers |
| `other-resources` | `unknown` | Other Resources |

### E. Resource Aggregate Slugs (`RESOURCE_AGGREGATE_SLUGS`)
- `question-bank` (Question Bank)
- `model-papers` (Model Papers)
- `previous-year-papers` (Previous Year Papers)
- `revision-notes` (Revision Notes)
- `solved-papers` (Solved Papers)
- `mid-term-papers` (Mid-Term Papers)
- `exclusive-short-notes` (Exclusive Short Notes)
- `ncert-textbook-solutions` (NCERT Textbook Solutions)
- `textbooksdownload` (All Textbooks Download)
- `1stpuctextbookdownload` (1st PUC Textbooks Download)
- `2ndpuctextbookdownload` (2nd PUC Textbooks Download)
- `10th-textbookspdfdownload` (10th Textbooks PDF Download)

### F. KCET Subpage Slugs (`KCET_SLUGS`)
- `kcet-pattern` (KCET Pattern & Syllabus)
- `kcet-cutoffs` (KCET Cutoffs & Seat Matrix)
- `kcet-latest-news` (KCET Latest News & Circulars)
- `kcet-mock-papers` (KCET Mock Papers)
- `kcet-question-bank` (KCET Question Bank)
- `kcet-question-papers` (KCET Question Papers)
- `kcet-revision-notes` (KCET Revision Notes)
- `kcet-solved-papers` (KCET Solved Papers)

### G. Static Page Slugs (`STATIC_SLUGS`)
- `about` (About Us)
- `contact` (Contact Us)
- `privacy-policy` (Privacy Policy)
- `terms-conditions` (Terms & Conditions)
- `content-updates` (Syllabus & Content Updates)
- `menu` (Navigation Menu)

---

## 5. Standard Procedures for Adding and Removing Types

### PROCEDURE 1: Adding a New Resource Type (e.g., "Formula Sheets")

To register a brand new resource type (e.g. `formula_sheet` / `formula-sheets`):

1. **Step 1: Update TypeScript Types & Metadata Map (`src/lib/data.ts`)**:
   Add the new item to `RESOURCE_TYPE_META`:
   ```typescript
   export const RESOURCE_TYPE_META: Record<string, ResourceTypeMeta> = {
     // ...
     formula_sheet: {
       title: "Formula Sheets",
       slug: "formula-sheets",
       description: "Quick chapter-wise formula cheat sheets",
       icon: "Zap",
       order: 11
     },
   };
   ```

2. **Step 2: Update Lucide Icon Map (`src/components/icon-map.tsx`)**:
   Ensure the icon string specified in `icon` exists in `src/components/icon-map.tsx`:
   ```typescript
   import { Zap } from "lucide-react";
   // Add Zap to icon map dictionary if not present
   ```

3. **Step 3: Update Admin CLI (`Inventory/scripts/manage_content.py`)**:
   Add `("formula_sheet", "Formula Sheets")` to `RESOURCE_TYPES`:
   ```python
   RESOURCE_TYPES = [
       ("chapter_notes", "Chapter-wise Notes"),
       ("formula_sheet", "Formula Sheets"),
       # ...
   ]
   ```

4. **Step 4: Sync & Rebuild**:
   ```bash
   npm run sync-data
   npm run build
   ```

---

### PROCEDURE 2: Removing an Existing Resource Type

If a resource type (e.g., `short_notes`) is deprecated:

1. **Step 1: Remove from `RESOURCE_TYPE_META` (`src/lib/data.ts`)**:
   Delete or comment out the target key from `RESOURCE_TYPE_META`.

2. **Step 2: Update Raw Inventory & Resources (`resources.json` / CSV)**:
   Either delete entries of that type or reclassify their `resourceType` to `unknown` or `chapter_notes`.

3. **Step 3: Remove from Admin CLI (`Inventory/scripts/manage_content.py`)**:
   Remove the tuple from `RESOURCE_TYPES`.

4. **Step 4: Sync & Rebuild**:
   ```bash
   npm run sync-data
   npm run build
   ```

---

### PROCEDURE 3: Adding a New Page Type / Route Type (e.g., "Interactive Quizzes")

If you want to create a whole new routing concept (e.g., `quiz` or `blueprint`):

1. **Step 1: Update `SlugEntry` Union Type (`src/lib/types.ts`)**:
   ```typescript
   export interface SlugEntry {
     type: 'class' | 'stream' | 'subject' | 'resource-aggregate' | 'kcet-subpage' | 'static' | 'quiz';
     entityId?: string;
     subType?: string;
     resourceType?: string;
     classId?: string;
     quizId?: string; // New optional property
   }
   ```

2. **Step 2: Register Slugs in Data Generator (`Inventory/scripts/generate_data.py`)**:
   Add the slug mapping in `build_slug_registry(metadata)`:
   ```python
   QUIZ_SLUGS = {
       "physics-quiz-101": {"type": "quiz", "quizId": "physics-101"},
   }

   # In build_slug_registry():
   for slug, info in QUIZ_SLUGS.items():
       registry[slug] = info
   ```

3. **Step 3: Create UI Template Component (`src/components/templates/quiz-page.tsx`)**:
   Create the React component handling the quiz experience.

4. **Step 4: Connect Dispatcher (`src/app/[...slug]/page.tsx`)**:
   Import `QuizPage` and handle `case 'quiz'` inside `DynamicPage`:
   ```typescript
   import { QuizPage } from "@/components/templates/quiz-page";

   // Inside switch (entry.type):
   case 'quiz': {
     return <QuizPage slug={slug[0]} quizId={entry.quizId} />;
   }
   ```

5. **Step 5: Test & Rebuild**:
   ```bash
   npm run sync-data
   npm run build
   ```

---

### PROCEDURE 4: Removing a Page Type / Route Type

To safely delete a page type (e.g. `kcet-subpage` or a legacy static route):

1. **Step 1: Remove Slugs from Data Generator (`Inventory/scripts/generate_data.py`)**:
   Remove the slug array or dict from `generate_data.py`.

2. **Step 2: Remove Case from Router Dispatcher (`src/app/[...slug]/page.tsx`)**:
   Remove `case 'your-deleted-type':` from the `switch (entry.type)` statement.

3. **Step 3: Clean Up Template Component**:
   Delete the unneeded component from `src/components/templates/`.

4. **Step 4: Update `SlugEntry` Type (`src/lib/types.ts`)**:
   Remove the type string from the union type.

5. **Step 5: Sync Datasets & Rebuild**:
   ```bash
   npm run sync-data
   npm run build
   ```

---

## 6. Dynamic Routing & Dispatcher (`src/app/[...slug]/page.tsx`)

The catch-all route `[...slug]/page.tsx` handles both single-segment (`/1st-puc-physics`) and two-segment (`/1st-puc-physics/chapter-notes`) URLs.

```typescript
// 1. Static Generation of ALL routes
export async function generateStaticParams() {
  const singleSlugs = getAllSlugs().map((slug) => ({ slug: [slug] }));
  const categorySlugs = getAllCategorySlugs().map(([subjectSlug, categorySlug]) => ({
    slug: [subjectSlug, categorySlug],
  }));
  return [...singleSlugs, ...categorySlugs];
}
```

### Route Dispatching Flow
When a request arrives or page is pre-rendered:
1. **2-Segment Route (`/[subjectSlug]/[categorySlug]`)**:
   - Validates that segment 1 is a valid subject and segment 2 is a valid resource category.
   - Renders `<ResourceCategoryPage />` (which displays PDFs or `<ComingSoon />` if empty).
2. **1-Segment Route (`/[slug]`)**:
   - Resolves `entry = resolveSlug(slug)`.
   - `entry.type === 'class'` ──> Renders `<ClassPage />`
   - `entry.type === 'stream'` ──> Renders `<StreamPage />`
   - `entry.type === 'subject'` ──> Renders `<SubjectPage />` (displays resource categories or `<ComingSoon />`)
   - `entry.type === 'resource-aggregate'` ──> Renders `<ResourceAggregatePage />` (displays grouped PDFs or `<ComingSoon />`)
   - `entry.type === 'kcet-subpage'` ──> Renders `<KcetSubpage />` (displays PDFs or `<ComingSoon />`)
   - `entry.type === 'static'` ──> Renders `<StaticPage />` (displays customized `<ComingSoon />`)

---

## 7. Summary Checklist for Backend Developers

- [x] All dataset JSON files are stored in `Inventory/content/`.
- [x] Always run `npm run sync-data` after modifying raw CSV files or Python generators.
- [x] Verify routing dispatcher changes in `src/app/[...slug]/page.tsx`.
- [x] Follow Procedure 1 & Procedure 3 when adding new resource or page types.
- [x] Always run `npm run build` to verify TypeScript types and static page generation before committing.
