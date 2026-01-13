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
      <div className="w-full">
        {children}
      </div>
      <LabNavDrawer components={components} />
    </div>
  );
}
