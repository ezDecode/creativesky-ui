'use client';

import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import React, { useEffect, useState } from 'react';

interface MDXContentProps {
  source: MDXRemoteSerializeResult;
  components?: Record<string, React.ComponentType<any>>;
}

export function MDXContent({ source, components }: MDXContentProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!source || !isMounted) return null;
  
  return <MDXRemote {...source} components={components} />;
}
