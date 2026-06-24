import prisma from '@/prisma/client';

import { Separator } from '@/components/ui/separator';
import AnnTimeLine from './_components/ann-timeline';

export default async function OrgPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 20,
  });

  return (
    <>
      <div className="px-4 py-6 sm:px-0">
        <div className="relative flex flex-col">
          <main className="flex-1">
            <div className="ml-10 mr-5 w-full space-y-2 overflow-auto">
              <h1 className="bg-linear-to-t from-next-foreground to-primary bg-clip-text pb-4 text-xl font-thin tracking-wide text-transparent dark:from-next-foreground dark:to-primary sm:text-xl xl:text-xl/none">
                最新公告
              </h1>
              {announcements.length === 0 ? (
                <div className="text-muted-foreground">暂无公告</div>
              ) : (
                <AnnTimeLine ann={announcements[0]} />
              )}

              <Separator />

              <h1 className="bg-linear-to-t from-next-foreground to-primary bg-clip-text pb-4 text-xl font-thin tracking-wide text-transparent dark:from-next-foreground dark:to-primary sm:text-xl xl:text-xl/none">
                历史公告
              </h1>
              {announcements &&
                announcements
                  .slice(1)
                  .map((ann) => <AnnTimeLine key={ann.id} ann={ann} />)}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
