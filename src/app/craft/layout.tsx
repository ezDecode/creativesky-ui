export default function CraftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
