"use client";

/**
 * Client-side wrapper for SourceCode display in MDX
 * 
 * These components fetch and display source code from the codebase.
 * They're used in MDX files like:
 *   <DemoCode name="adaptive-tooltip" />
 *   <ComponentCode name="adaptive-tooltip" />
 */

import * as React from "react";
import { CodeBlock } from "@/components/code/CodeBlock";

interface SourceCodeProps {
  name: string;
  title?: string;
}

/**
 * DemoCode - Display the demo source code for a component
 */
export function DemoCodeWrapper({ name, title }: SourceCodeProps) {
  const [code, setCode] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchCode = async () => {
      try {
        const res = await fetch(`/api/source?type=demo&name=${name}`);
        if (!res.ok) throw new Error("Failed to fetch demo code");
        const data = await res.json();
        setCode(data.code);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchCode();
  }, [name]);

  if (loading) {
    return (
      <div className="my-6 rounded-xl bg-muted/20 p-8 flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Loading demo code...
        </div>
      </div>
    );
  }

  if (error || !code) {
    return (
      <div className="my-6 rounded-xl bg-muted/20 p-4 text-muted-foreground text-sm">
        Unable to load demo code for <code className="bg-muted px-1.5 py-0.5 rounded">{name}</code>
      </div>
    );
  }

  return (
    <div className="my-6">
      {title && <h3 className="text-lg font-medium mb-3">{title}</h3>}
      <CodeBlock code={code} language="tsx" filename={`${toPascalCase(name)}Demo.tsx`} />
    </div>
  );
}

/**
 * ComponentCode - Display the full component source code
 */
export function ComponentCodeWrapper({ name, title }: SourceCodeProps) {
  const [code, setCode] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchCode = async () => {
      try {
        const res = await fetch(`/api/source?type=component&name=${name}`);
        if (!res.ok) throw new Error("Failed to fetch component code");
        const data = await res.json();
        setCode(data.code);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchCode();
  }, [name]);

  if (loading) {
    return (
      <div className="my-6 rounded-xl bg-muted/20 p-8 flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Loading component code...
        </div>
      </div>
    );
  }

  if (error || !code) {
    return (
      <div className="my-6 rounded-xl bg-muted/20 p-4 text-muted-foreground text-sm">
        Unable to load component code for <code className="bg-muted px-1.5 py-0.5 rounded">{name}</code>
      </div>
    );
  }

  return (
    <div className="my-6">
      {title && <h3 className="text-lg font-medium mb-3">{title}</h3>}
      <CodeBlock code={code} language="tsx" filename={`${name}.tsx`} />
    </div>
  );
}

function toPascalCase(str: string): string {
  return str
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}
