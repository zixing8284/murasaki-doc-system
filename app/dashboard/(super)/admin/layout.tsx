import SideNav from '@/app/dashboard/(super)/admin/_components/sidenav';

export const metadata = {
  title: '系统管理',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section>
        <div className="container mt-6 flex flex-col items-stretch justify-start gap-6 text-sm/[24px] md:flex-row">
          <SideNav />
          <div className="flex min-w-0 flex-1 flex-col lg:mt-0">
            <section className="mb-8 flex flex-col gap-5">{children}</section>
          </div>
        </div>
      </section>
    </>
  );
}
