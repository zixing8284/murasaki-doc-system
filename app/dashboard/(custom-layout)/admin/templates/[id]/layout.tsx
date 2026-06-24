export default function TemplateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex h-full flex-col px-2">{children}</div>;
}
