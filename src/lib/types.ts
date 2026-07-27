// TypeScript interfaces for the PUC Notes data model

export interface ClassData {
  id: string;
  name: string;
  slug: string;
  board: string;
  order: number;
  streams: string[];
}

export interface StreamData {
  id: string;
  classId: string;
  name: string;
  slugs: string[];
  subjects: string[];
}

export interface SubjectData {
  id: string;
  classId: string;
  streamId: string;
  name: string;
  paperSlug: string;
  notesSlug: string;
}

export interface ResourceData {
  id: string;
  linkText: string;
  pdfUrl: string;
  fileId: string;
  subject: string;
  resourceType: string;
  chapterName: string;
  notes: string;
}

export interface ResourceCategory {
  id: string;           // e.g., "chapter_notes"
  subjectId: string;    // e.g., "1st-pu-physics"
  title: string;        // e.g., "Chapter-wise Notes"
  slug: string;         // e.g., "chapter-notes"
  description: string;  // e.g., "Complete chapter-wise notes"
  icon: string;         // Lucide icon name: "BookOpen"
  count: number;        // Number of PDFs in this category
}

export interface SlugEntry {
  type: 'class' | 'stream' | 'subject' | 'resource-aggregate' | 'resource-category' | 'kcet-subpage' | 'static';
  entityId?: string;
  subType?: string;
  resourceType?: string;
  classId?: string;
  categorySlug?: string;
}

export interface SeoMetadata {
  title: string;
  description: string;
  displayTitle?: string;
}

export type SlugRegistry = Record<string, SlugEntry>;
export type ClassesMap = Record<string, ClassData>;
export type StreamsMap = Record<string, StreamData>;
export type SubjectsMap = Record<string, SubjectData>;
export type ResourcesMap = Record<string, ResourceData[]>;
export type MetadataMap = Record<string, SeoMetadata>;
