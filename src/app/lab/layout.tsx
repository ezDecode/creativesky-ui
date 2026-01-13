import { getAllComponentsMetadata } from "@/lib/registry/resolver";
import { LabNavDrawer } from "@/components/lab/LabNavDrawer";

export default function LabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const components = getAllComponentsMetadata();

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        {children}
      </div>
      <LabNavDrawer components={components} />
    </div>
  );
}
