import DashboardHeader from '@/app/dashboard/_components/header';
import DashboardFooter from '@/app/dashboard/_components/footer';
import { BackgroundProvider } from '@/app/dashboard/_components/background-provider';
import BackgroundWrapper from '@/app/dashboard/_components/background-wrapper';
import { getUser } from '@/lib/dal';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <>
      <BackgroundProvider>
        <DashboardHeader username={user?.name ?? ''} />
        <BackgroundWrapper>{children}</BackgroundWrapper>
        <DashboardFooter />
      </BackgroundProvider>
    </>
  );
}
