import fs from 'fs';
import path from 'path';
import type {
  ClassData, StreamData, SubjectData, ResourceData, ResourceCategory,
  SeoMetadata, SlugEntry,
  ClassesMap, StreamsMap, SubjectsMap, ResourcesMap, MetadataMap, SlugRegistry,
} from './types';

// ──────────────────────────────────────────────
// JSON file readers (cached per build)
// ──────────────────────────────────────────────

const CONTENT_DIR = path.join(process.cwd(), 'Inventory', 'content');

function readJson<T>(filename: string): T {
  const filePath = path.join(CONTENT_DIR, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

// ──────────────────────────────────────────────
// Classes
// ──────────────────────────────────────────────

export function getClasses(): ClassesMap {
  return readJson<ClassesMap>('classes.json');
}

export function getClass(id: string): ClassData | null {
  return getClasses()[id] ?? null;
}

export function getClassBySlug(slug: string): ClassData | null {
  const classes = getClasses();
  return Object.values(classes).find(c => c.slug === slug) ?? null;
}

export function getSortedClasses(): ClassData[] {
  return Object.values(getClasses()).sort((a, b) => a.order - b.order);
}

// ──────────────────────────────────────────────
// Streams
// ──────────────────────────────────────────────

export function getStreams(): StreamsMap {
  return readJson<StreamsMap>('streams.json');
}

export function getStream(id: string): StreamData | null {
  return getStreams()[id] ?? null;
}

export function getStreamsByClass(classId: string): StreamData[] {
  const streams = getStreams();
  return Object.values(streams).filter(s => s.classId === classId);
}

export function getStreamBySlug(slug: string): StreamData | null {
  const streams = getStreams();
  return Object.values(streams).find(s => s.slugs.includes(slug)) ?? null;
}

// ──────────────────────────────────────────────
// Subjects
// ──────────────────────────────────────────────

export function getSubjects(): SubjectsMap {
  return readJson<SubjectsMap>('subjects.json');
}

export function getSubject(id: string): SubjectData | null {
  return getSubjects()[id] ?? null;
}

export function getSubjectsByStream(streamId: string): SubjectData[] {
  const subjects = getSubjects();
  return Object.values(subjects).filter(s => s.streamId === streamId);
}

export function getSubjectsByClass(classId: string): SubjectData[] {
  const subjects = getSubjects();
  return Object.values(subjects).filter(s => s.classId === classId);
}

export function getSubjectBySlug(slug: string): SubjectData | null {
  const subjects = getSubjects();
  return Object.values(subjects).find(
    s => s.paperSlug === slug || s.notesSlug === slug
  ) ?? null;
}

// ──────────────────────────────────────────────
// Resources
// ──────────────────────────────────────────────

export function getAllResources(): ResourcesMap {
  return readJson<ResourcesMap>('resources.json');
}

export function getResources(slug: string): ResourceData[] {
  return getAllResources()[slug] ?? [];
}

export function getResourcesByType(resourceType: string): ResourceData[] {
  const all = getAllResources();
  const results: ResourceData[] = [];
  for (const resources of Object.values(all)) {
    for (const r of resources) {
      if (r.resourceType === resourceType) {
        results.push(r);
      }
    }
  }
  return results;
}

// ──────────────────────────────────────────────
// Resource Type Metadata (single source of truth)
// ──────────────────────────────────────────────

export interface ResourceTypeMeta {
  title: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
}

export const RESOURCE_TYPE_META: Record<string, ResourceTypeMeta> = {
  chapter_notes:       { title: "Chapter-wise Notes",     slug: "chapter-notes",       description: "Complete chapter-wise notes",           icon: "BookOpen",       order: 1 },
  model_paper:         { title: "Model Papers",           slug: "model-papers",        description: "Practice model papers",                 icon: "FileText",       order: 2 },
  solved_paper:        { title: "Solved Papers",          slug: "solved-papers",       description: "Solved examination papers",              icon: "CheckCircle",    order: 3 },
  previous_year_paper: { title: "Previous Year Papers",   slug: "previous-papers",     description: "Board examination papers",               icon: "Archive",        order: 4 },
  question_bank:       { title: "Question Bank",          slug: "question-bank",       description: "Question bank PDFs",                    icon: "Library",        order: 5 },
  textbook:            { title: "Textbook",               slug: "textbook",            description: "Official textbook",                     icon: "Book",           order: 6 },
  revision_notes:      { title: "Revision Notes",         slug: "revision-notes",      description: "Quick revision material",               icon: "Zap",            order: 7 },
  short_notes:         { title: "Exclusive Short Notes",  slug: "short-notes",         description: "Exam preparation notes",                icon: "Star",           order: 8 },
  ncert_solutions:     { title: "NCERT Solutions",        slug: "ncert-solutions",     description: "NCERT textbook solutions",              icon: "GraduationCap",  order: 9 },
  mid_term_paper:      { title: "Mid-Term Papers",        slug: "mid-term-papers",     description: "Mid-term examination papers",            icon: "ClipboardList",  order: 10 },
  old_notes:           { title: "Old Notes (Archive)",    slug: "old-notes",           description: "Previously available chapter-wise notes", icon: "Archive",        order: 11 },
  unknown:             { title: "Other Resources",        slug: "other-resources",     description: "Additional study material",              icon: "FolderOpen",     order: 99 },
};

/** Reverse lookup: category slug → resource type key */
export function getCategorySlugToTypeMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const [typeKey, meta] of Object.entries(RESOURCE_TYPE_META)) {
    map[meta.slug] = typeKey;
  }
  return map;
}

// ──────────────────────────────────────────────
// Resource Categories for Subject Dashboard
// ──────────────────────────────────────────────

/**
 * Get all resources for a subject by aggregating paperSlug, notesSlug, and any archive slug.
 */
export function getAllResourcesForSubject(subject: SubjectData): ResourceData[] {
  const paperResources = getResources(subject.paperSlug);
  const notesResources = getResources(subject.notesSlug);
  // Also include archived notes if they exist (e.g. "2nd-pu-notes-english-archive")
  const archiveSlug = `${subject.notesSlug}-archive`;
  const archiveResources = getResources(archiveSlug);
  return [...paperResources, ...notesResources, ...archiveResources];
}

/**
 * Get resource categories for a subject dashboard.
 * Dynamically computes available categories from the actual resource inventory.
 * Only returns categories that have at least one PDF.
 */
export function getResourceCategoriesForSubject(subjectId: string): ResourceCategory[] {
  const subject = getSubject(subjectId);
  if (!subject) return [];

  const allResources = getAllResourcesForSubject(subject);

  // Group resources by type
  const grouped: Record<string, ResourceData[]> = {};
  for (const r of allResources) {
    const type = r.resourceType || 'unknown';
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(r);
  }

  // Build category objects, sorted by display order
  const categories: ResourceCategory[] = [];
  for (const [typeKey, resources] of Object.entries(grouped)) {
    const meta = RESOURCE_TYPE_META[typeKey] || RESOURCE_TYPE_META['unknown'];
    categories.push({
      id: typeKey,
      subjectId,
      title: meta.title,
      slug: meta.slug,
      description: meta.description,
      icon: meta.icon,
      count: resources.length,
    });
  }

  // Sort by the defined order
  categories.sort((a, b) => {
    const orderA = RESOURCE_TYPE_META[a.id]?.order ?? 99;
    const orderB = RESOURCE_TYPE_META[b.id]?.order ?? 99;
    return orderA - orderB;
  });

  return categories;
}

/**
 * Get resources for a specific category within a subject.
 */
export function getResourcesForCategory(subjectId: string, categorySlug: string): ResourceData[] {
  const subject = getSubject(subjectId);
  if (!subject) return [];

  const slugToType = getCategorySlugToTypeMap();
  const resourceType = slugToType[categorySlug];
  if (!resourceType) return [];

  const allResources = getAllResourcesForSubject(subject);
  return allResources.filter(r => (r.resourceType || 'unknown') === resourceType);
}

/**
 * Get category metadata from a category slug.
 */
export function getCategoryMeta(categorySlug: string): ResourceTypeMeta | null {
  const slugToType = getCategorySlugToTypeMap();
  const typeKey = slugToType[categorySlug];
  if (!typeKey) return null;
  return RESOURCE_TYPE_META[typeKey] ?? null;
}

// ──────────────────────────────────────────────
// SEO Metadata
// ──────────────────────────────────────────────

export function getAllMetadata(): MetadataMap {
  return readJson<MetadataMap>('metadata.json');
}

export function getMetadata(slug: string): SeoMetadata | null {
  return getAllMetadata()[slug] ?? null;
}

// ──────────────────────────────────────────────
// Slug Registry
// ──────────────────────────────────────────────

export function getSlugRegistry(): SlugRegistry {
  return readJson<SlugRegistry>('slug-registry.json');
}

export function resolveSlug(slug: string): SlugEntry | null {
  return getSlugRegistry()[slug] ?? null;
}

export function getAllSlugs(): string[] {
  return Object.keys(getSlugRegistry());
}

/**
 * Get all category slugs for sitemap and static generation.
 * Returns an array of [subjectSlug, categorySlug] pairs.
 */
export function getAllCategorySlugs(): [string, string][] {
  const subjects = getSubjects();
  const result: [string, string][] = [];
  const seen = new Set<string>();

  for (const subject of Object.values(subjects)) {
    const categories = getResourceCategoriesForSubject(subject.id);

    // Generate category routes for both paperSlug and notesSlug
    for (const parentSlug of [subject.paperSlug, subject.notesSlug]) {
      if (!parentSlug) continue;
      for (const cat of categories) {
        const key = `${parentSlug}/${cat.slug}`;
        if (!seen.has(key)) {
          seen.add(key);
          result.push([parentSlug, cat.slug]);
        }
      }
    }
  }

  return result;
}

// ──────────────────────────────────────────────
// Breadcrumb helpers
// ──────────────────────────────────────────────

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export function buildBreadcrumbs(slug: string): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];
  const entry = resolveSlug(slug);
  if (!entry) return crumbs;

  switch (entry.type) {
    case 'class': {
      const cls = getClass(entry.entityId!);
      if (cls) crumbs.push({ label: cls.name, href: `/${cls.slug}` });
      break;
    }
    case 'stream': {
      const stream = getStream(entry.entityId!);
      if (stream) {
        const cls = getClass(stream.classId);
        if (cls) crumbs.push({ label: cls.name, href: `/${cls.slug}` });
        crumbs.push({ label: stream.name, href: `/${slug}` });
      }
      break;
    }
    case 'subject': {
      const subject = getSubject(entry.entityId!);
      if (subject) {
        const cls = getClass(subject.classId);
        if (cls) crumbs.push({ label: cls.name, href: `/${cls.slug}` });
        const stream = getStream(subject.streamId);
        if (stream && stream.slugs.length > 0) {
          crumbs.push({ label: stream.name, href: `/${stream.slugs[0]}` });
        }
        crumbs.push({ label: subject.name, href: `/${slug}` });
      }
      break;
    }
    case 'kcet-subpage': {
      const cls = getClass('kcet');
      if (cls) crumbs.push({ label: cls.name, href: `/${cls.slug}` });
      const meta = getMetadata(slug);
      crumbs.push({ label: meta?.title?.split('|')[0]?.trim() || slug, href: `/${slug}` });
      break;
    }
    default: {
      const meta = getMetadata(slug);
      crumbs.push({ label: meta?.title?.split('|')[0]?.trim() || slug, href: `/${slug}` });
      break;
    }
  }

  return crumbs;
}

/**
 * Build breadcrumbs for a resource category page.
 * Home > Class > Stream > Subject > Category
 */
export function buildCategoryBreadcrumbs(subjectSlug: string, categorySlug: string): BreadcrumbItem[] {
  // Start with the subject breadcrumbs
  const crumbs = buildBreadcrumbs(subjectSlug);

  // Add the category crumb
  const catMeta = getCategoryMeta(categorySlug);
  if (catMeta) {
    crumbs.push({
      label: catMeta.title,
      href: `/${subjectSlug}/${categorySlug}`,
    });
  }

  return crumbs;
}
