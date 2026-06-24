import prisma from '@/prisma/client';

import Templates from './_components/templates';

export default async function Page() {
  const templates = await prisma.template.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* ===== Content ===== */}
      <div className="flex flex-1 flex-col overflow-hidden px-4 pb-6 md:px-8">
        <div>
          <h1 className="text-2xl font-normal tracking-tight">模板中心</h1>

          <p className="text-muted-foreground">
            浏览和管理所有可用的模板，用于快速创建日常管理记录
          </p>
        </div>

        <Templates templates={templates} />
      </div>
    </div>
  );
}
