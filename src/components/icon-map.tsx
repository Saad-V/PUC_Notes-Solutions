import React from "react";
import {
  BookOpen,
  FileText,
  Archive,
  Library,
  CheckCircle,
  Book,
  Zap,
  Star,
  GraduationCap,
  ClipboardList,
  FolderOpen,
  type LucideIcon,
} from "lucide-react";

/**
 * Centralized icon resolver. Maps icon name strings (from RESOURCE_TYPE_META)
 * to Lucide React components.
 *
 * To add a new icon: import it above and add it to the map below.
 */
export const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen,
  FileText,
  Archive,
  Library,
  CheckCircle,
  Book,
  Zap,
  Star,
  GraduationCap,
  ClipboardList,
  FolderOpen,
};

/**
 * Get a Lucide icon component by name string.
 * Falls back to FileText if the icon is not found.
 */
export function getIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName] ?? FileText;
}

/**
 * Render a Lucide icon by name using React.createElement safely inside JSX.
 */
export function renderIcon(iconName: string, className?: string) {
  const IconComponent = getIcon(iconName);
  return React.createElement(IconComponent, { className });
}
