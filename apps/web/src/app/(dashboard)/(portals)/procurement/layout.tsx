export default function ProcurementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {children}
    </div>
  );
}
