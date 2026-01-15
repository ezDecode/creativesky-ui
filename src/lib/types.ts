import React from "react";

export type ComponentCategory = 
  | "animation" 
  | "interaction" 
  | "form" 
  | "navigation" 
  | "layout" 
  | "visual" 
  | "data-display" 
  | "feedback"
  | "ui";

export type ComponentStatus = "stable" | "experimental" | "deprecated";

export type ComponentPricing = "free" | "paid";

export type ComponentSourceType = "local" | "remote" | "user-uploaded" | "mdx";

export interface ComponentSource {
  type: ComponentSourceType;
  path: string;
  url?: string;
}

export interface ComponentDemo {
  variants: string[];
  defaultProps: Record<string, any>;
  /** Whether this component needs a scroll container */
  scrollable?: boolean;
  /** External demo URL */
  external?: string;
  /** Minimum height for demo container */
  minHeight?: string;
}

export interface ComponentDesign {
  surface: "flat" | "elevated" | "inset" | "glassmorphic";
  motion: "spring" | "smooth" | "linear" | "none" | "scroll-locked";
}

export interface RegistryComponent {
  id: string;
  title: string;
  description: string;
  category: ComponentCategory;
  status: ComponentStatus;
  pricing: ComponentPricing;
  tags: string[];
  date: string;
  featured?: boolean;
  new?: boolean;
  source: ComponentSource;
  demo: ComponentDemo;
  design: ComponentDesign;
  readme?: string;
  dependencies?: string[];
  author?: {
    name: string;
    url?: string;
  };
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
