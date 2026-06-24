import prisma from '@/prisma/client';

import { DataTable as FileTable } from './_components/file-table';

import type { File as PrismaFile } from '@prisma/client';

import { columns } from './_components/columns';

export const metadata = {
  title: '文件中心',
};
export type PrismaFileWithCategory = PrismaFile & {
  categories: {
    name: string;
  }[];
};

async function getFileData(): Promise<PrismaFileWithCategory[]> {
  const files = await prisma.file.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      categories: true,
    },
  });

  return files;
}

export default async function FileCenterPage() {
  const [data, fileCategories] = await Promise.all([
    getFileData(),
    prisma.fileCategory.findMany({
      select: {
        name: true,
      },
    }),
  ]);
  const fileCatsArray = fileCategories.map((cat) => cat.name);
  return (
    <>
      <div className="relative flex flex-col">
        <main className="flex-1">
          <div className="container grid items-center gap-2 pb-8 pt-12">
            <div className="w-full space-y-2 overflow-auto">
              <h1 className="bg-linear-to-t from-next-foreground to-primary bg-clip-text pb-4 text-xl font-thin tracking-wide text-transparent dark:from-next-foreground dark:to-primary sm:text-xl xl:text-xl/none">
                文件中心
              </h1>

              <FileTable
                columns={columns}
                data={data}
                fileCats={fileCatsArray}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
