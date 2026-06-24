export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* NOTE: sticky nav rely on this div */}
      <div className="">{children}</div>
    </>
  );
}
