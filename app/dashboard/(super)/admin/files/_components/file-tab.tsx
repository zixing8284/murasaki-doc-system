import { columns } from './columns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import prisma from '@/prisma/client';

import { DataTable as FileTable } from './file-table';

import type { File as PrismaFile } from '@prisma/client';

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

export default async function FileTab() {
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
    <div className="group relative my-4 flex flex-col space-y-2">
      <Tabs defaultValue="list" className="relative mr-auto w-full">
        <div className="flex items-center justify-between pb-3">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="list"
              className="relative h-9 rounded-none border-b-2 border-b-transparent px-4 pb-3 pt-2 text-lg font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:bg-next data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              文件列表
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="list"
          className="relative rounded-md bg-next dark:bg-night"
        >
          <FileTable columns={columns} data={data} fileCats={fileCatsArray} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
