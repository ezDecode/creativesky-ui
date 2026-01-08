"use client";

/**
 * Client-side wrapper for ComponentPreview
 * 
 * This component must be client-side because ComponentPreview uses hooks.
 * It's used in the MDX component map to allow <ComponentPreview /> in MDX files.
 */

import { ComponentPreview } from '@/components/lab/ComponentPreview';

export function ComponentPreviewWrapper(props: { name: string }) {
  return <ComponentPreview {...props} />;
}
