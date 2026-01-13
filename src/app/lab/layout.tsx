export default function LabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full grid-cols-12 bg-background text-foreground">
      {children}
    </div>
  );
}
