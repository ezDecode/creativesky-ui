import { getAllComponentsMetadata } from "@/lib/registry/resolver";
import { LabNavigation } from "@/components/lab/LabNavigation";
import { Shell } from "@/components/layout/Shell";

export default function LabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const components = getAllComponentsMetadata();

  return (
    <Shell leftRail={<LabNavigation components={components} />}>
      {/* Mobile top nav - rendered by LabNavigation internally */}
      <div className="lg:hidden">
        <LabNavigation components={components} mobileOnly />
      </div>
      {children}
    </Shell>
  );
}
