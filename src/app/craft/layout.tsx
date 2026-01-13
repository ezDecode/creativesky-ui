import { getAllComponentsMetadata } from "@/lib/registry/resolver";
import { CraftNavDrawer } from "@/components/craft/CraftNavDrawer";

export default function CraftLayout({
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
      <CraftNavDrawer components={components} />
    </div>
  );
}
