import { notFound } from 'next/navigation';

import prisma from '@/prisma/client';
import Previewer from '@/components/ann-editor/previewer';

const emptyValueStrct = JSON.stringify([
  {
    children: [
      {
        text: '',
      },
    ],
    type: 'p',
  },
]);

export default async function AnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const ann = await prisma.announcement.findUnique({
    where: {
      id: decodeURIComponent(id),
    },
  });

  if (!ann) {
    return notFound();
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="relative flex flex-col">
        <main className="flex-1">
          <div className="ml-10 mr-5 w-full space-y-4 overflow-auto">
            <div className="text-xs text-muted-foreground">
              {new Date(ann.createdAt).toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
            <Previewer value={JSON.parse(ann.content || emptyValueStrct)} />
          </div>
        </main>
      </div>
    </div>
  );
}
