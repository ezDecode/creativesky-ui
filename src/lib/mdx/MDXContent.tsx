'use client';

import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import React from 'react';

interface MDXContentProps {
  source: MDXRemoteSerializeResult;
  components?: Record<string, React.ComponentType<any>>;
}

export function MDXContent({ source, components }: MDXContentProps) {
  if (!source) return null;
  return <MDXRemote {...source} components={components} />;
}
