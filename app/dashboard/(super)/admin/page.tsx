import { Separator } from '@/components/ui/separator';

import CreatePostCategory from './_components/create-post-cat';

import prisma from '@/prisma/client';
import DeletePostCategory from './_components/delete-post-cat';
import AnnProduce from './_components/ann-produce';

export default async function AdminPage() {
  const postCategories = await prisma.postCategory.findMany();

  return (
    <>
      <div className="relative overflow-hidden rounded-md bg-next shadow-sunlight dark:shadow-hairo">
        <div className="relative p-6">
          <h4 className="text-lg font-semibold">管理目录</h4>
          <p className="text-muted-foreground">
            用于日常管理创建记录时选择目录
          </p>
          <fieldset className="my-2 rounded-lg">
            <CreatePostCategory />
          </fieldset>
          <Separator className="mt-4 w-2/3" />

          <fieldset className="my-2 rounded-lg">
            <DeletePostCategory postCategories={postCategories} />
          </fieldset>
        </div>
        <footer className="flex min-h-14 items-center border-t border-sunlight bg-muted px-6 py-3 text-sm leading-6 text-muted-foreground dark:border-hairo">
          <div className="flex items-center">
            注意目录名不能重复，删除目录将解除该目录下所有记录与它的关联。
          </div>
          <div className="ml-auto flex items-center justify-end"></div>
        </footer>
      </div>

      <AnnProduce />
    </>
  );
}
