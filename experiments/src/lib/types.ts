import React from "react";

export type ComponentCategory = 
  | "animation" 
  | "interaction" 
  | "form" 
  | "navigation" 
  | "layout" 
  | "visual" 
  | "data-display" 
  | "feedback";

export type ComponentStatus = "stable" | "experimental";

export type ComponentSourceType = "local" | "remote" | "user-uploaded" | "mdx";

export interface ComponentSource {
  type: ComponentSourceType;
  path: string;
  url?: string; // For remote sources
}

export interface ComponentDemo {
  variants: string[];
  defaultProps: Record<string, any>;
}

export interface ComponentDesign {
  surface: "flat" | "elevated" | "inset";
  motion: "spring" | "smooth" | "linear" | "none";
}

export interface RegistryComponent {
  id: string;
  title: string;
  description: string;
  category: ComponentCategory;
  status: ComponentStatus;
  tags: string[];
  date: string;
  featured?: boolean;
  new?: boolean;
  source: ComponentSource;
  demo: ComponentDemo;
  design: ComponentDesign;
  readme?: string;
  dependencies?: string[];
}

export interface ComponentRegistry {
  version: string;
  components: RegistryComponent[];
}

export interface NavItem {
  title: string;
  href: string;
  icon?: any;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}
