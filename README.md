Yes. In fact, I'd recommend treating the vibe coding AI like a senior full-stack engineer joining an existing project. The more context it has, the better the result.

Below is the kind of specification I would give it.

---

# PUC Notes & Solutions - Complete Project Specification

## Project Overview

This project is a complete rewrite of an existing educational resource website.

Current website:
[https://www.pucnotes-solutions.com](https://www.pucnotes-solutions.com)

The existing website is built on Wix.

The goal is to migrate it completely to a modern stack while preserving SEO rankings.

The project is **NOT** a redesign.

It is primarily a migration with UX improvements and infrastructure improvements.

---

# Main Goals

Priority order

1. Preserve SEO
2. Reduce hosting costs
3. Improve user experience
4. Increase advertisement revenue
5. Make content management easier
6. Prepare for future expansion

---

# Existing Architecture

Current flow

```
Google Search

↓

Wix Website

↓

Google Drive PDF

↓

User reads PDF
```

Problems

* Wix hosting is expensive
* Google Drive causes users to leave the website
* Ads generate very little revenue
* Difficult to maintain
* Difficult to scale

---

# New Architecture

```
Google Search

↓

Next.js Website

↓

Rewarded Advertisement

↓

Website PDF Viewer

↓

PDF
```

Users stay on the website.

Revenue increases.

SEO remains intact.

---

# Tech Stack

Use

* Next.js (App Router)
* TypeScript
* TailwindCSS
* shadcn/ui
* Vercel Deployment

Prefer Server Components wherever possible.

Avoid unnecessary client-side rendering.

---

# Important Rule

DO NOT redesign the website into something completely different.

Modernize it while keeping navigation familiar.

The website should still feel like the same website that users know.

---

# Existing Site Structure

```
Homepage

10th

1st PU

2nd PU

KCET
```

Inside

```
1st PU

↓

Science

↓

Subject

↓

Resources

↓

PDF
```

Example

```
1st PU

↓

Science

↓

Computer Science

↓

Chapter 1

↓

PDF Viewer
```

---

# Streams

1st PU

Science

Commerce

Languages

---

2nd PU

Science

Commerce

Languages

---

KCET

Physics

Chemistry

Maths

Biology

---

10th

Standard subjects

---

# URL Preservation

This is the most important requirement.

Current URL

```
/1st-puc-computer-science
```

MUST REMAIN

```
/1st-puc-computer-science
```

DO NOT rename URLs.

DO NOT change slugs.

DO NOT add unnecessary nesting.

Every indexed page should remain accessible.

---

# SEO Requirements

Preserve

Title

Description

Canonical

OpenGraph

Twitter metadata

Structured Data

H1

URL

Slug

Sitemap

Robots

Generate sitemap automatically.

---

# Content Source

The project is completely data-driven.

Do NOT hardcode pages.

Everything should be generated from JSON.

Example

```
subjects.json

chapters.json

resources.json

metadata.json
```

The frontend should render pages from these files.

---

# Homepage

Homepage should contain

Hero

Search

Choose Class

10th

1st PU

2nd PU

KCET

Popular Subjects

Recently Updated

Latest KCET Updates (future)

Footer

Do NOT clutter the homepage.

---

# Navigation

Flow

```
Homepage

↓

Class

↓

Stream

↓

Subject

↓

Resource Type

↓

PDF
```

Example

```
Homepage

↓

2nd PU

↓

Science

↓

Physics

↓

Notes

↓

Chapter 5
```

---

# Resource Types

Support

Notes

Question Bank

Model Papers

Previous Papers

Solved Papers

Textbooks

Revision Notes

Short Notes

KCET Resources

Each resource type should be represented consistently across all subjects.

---

# Subject Page Layout

Example

```
2nd PU Physics

----------------------------------

Notes

Chapter 1

Chapter 2

Chapter 3

...

----------------------------------

Question Bank

----------------------------------

Previous Papers

----------------------------------

Model Papers

----------------------------------

Textbook

----------------------------------
```

Cards instead of Wix buttons.

Responsive layout.

---

# PDF Viewer

PDF should open INSIDE the website.

Do NOT immediately redirect users to Google Drive.

Layout

```
Breadcrumb

Title

Download Button

Share Button

Report Issue Button

PDF Viewer

Previous

Next

Related Resources

Footer
```

---

# Phase 1 PDF Strategy

Phase 1 will contain mixed hosting.

Some PDFs

```
Self Hosted
```

Others

```
Google Drive
```

The frontend must support both without changing page layouts.

Abstract the PDF source.

Example

```
pdfType

local

drive
```

The viewer should automatically handle both.

---

# Advertisement Strategy

Instead of showing ads everywhere.

Only require a rewarded advertisement before unlocking PDF access.

Flow

```
Open PDF

↓

Rewarded Advertisement

↓

Unlock

↓

5-hour Session

↓

Unlimited PDFs
```

Store unlock status in

```
localStorage

or

Cookie
```

Store

```
unlockUntil
```

If current time is below unlockUntil

Skip ad.

---

# Search

Create instant search.

Search should search

Subjects

Chapters

Notes

Question Banks

Model Papers

Textbooks

Previous Papers

Search index should be generated automatically.

---

# Related Resources

Every page should display

Related Notes

Related Question Banks

Related Textbooks

Related KCET Material

Automatically.

---

# Performance

Target

95+

Lighthouse

Use

Static Rendering

Image Optimization

Dynamic Imports

Lazy Loading

Code Splitting

Minimal JS

---

# Accessibility

Semantic HTML

Keyboard Navigation

Proper Heading Hierarchy

ARIA Labels

Good Contrast

---

# File Structure

```
app/

components/

lib/

hooks/

public/

    pdf/

        10th/

        1st-pu/

        2nd-pu/

        kcet/

inventory/

    sitemap.xml

    metadata.csv

    pages.csv

    pdf_inventory.csv

    redirects.csv

content/

    subjects.json

    chapters.json

    resources.json

docs/

    methodology.md

    architecture.md

    migration.md

scripts/

    extract_metadata.py

    extract_pdf_links.py

    download_pdfs.py

    generate_json.py

    generate_sitemap.py

    verify_links.py
```

---

# Future Admin Workflow

The website should eventually support this workflow.

```
Upload PDF

↓

Run Import Script

↓

Generate JSON

↓

Deploy

↓

Done
```

No manual coding should be required when new PDFs are added.

---

# UI Style

Modern

Minimal

Fast

Educational

No flashy animations.

Focus on readability.

Use shadcn/ui components.

Rounded cards.

Consistent spacing.

Responsive.

---

# Deployment

Deploy on

Vercel

Keep the project compatible with static generation wherever possible.

---

# Migration Rules

Never break an existing URL.

Never remove metadata.

Never remove sitemap entries.

If a page must move, create a 301 redirect.

---

# Success Criteria

The migration is considered successful if:

* Existing Google rankings are preserved.
* Every existing URL remains accessible.
* PDFs can be viewed within the website.
* Phase 1 supports both Google Drive-hosted and self-hosted PDFs.
* Users are required to watch one rewarded advertisement per approximately 5-hour session before accessing PDFs.
* The frontend is fully data-driven, with pages generated from structured inventory files.
* Lighthouse performance scores remain high.
* The codebase is modular, maintainable, and easy to extend.
* Future migration from Google Drive to self-hosted PDFs requires only updating the inventory data, not rewriting application logic.

---
