import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import LoadingDots from '@/app/ui/icons/loading-dots';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { createPost } from '@/lib/actions/post.action';
import { cn } from '@/lib/utils';
import { Pencil2Icon } from '@radix-ui/react-icons';

import type { PostCategory } from '@prisma/client';

export function CreatePostButton({
  postCategories,
}: {
  postCategories: PostCategory[];
}) {
  const [isPendingCreate, startCreateTransition] = useTransition();
  const router = useRouter();

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="flex h-max w-full flex-col items-start justify-start sm:w-auto sm:min-w-61.5"
            variant="outline"
          >
            <div className="flex w-full flex-row items-center justify-between space-y-0 py-2">
              <p className="text-sm">新建记录</p>
              <Pencil2Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              创建一个空的记录文档
            </p>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>新建记录</DialogTitle>
            <DialogDescription>选择一个目录，然后开始记录</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 items-center gap-4">
              {postCategories.length > 0 &&
                postCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant="link"
                    className={cn({
                      'cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300':
                        isPendingCreate,
                    })}
                    onClick={async () => {
                      startCreateTransition(async () => {
                        const post = await createPost({
                          categoryId: category.id,
                        });
                        router.refresh();
                        router.push(`/dashboard/manage/post/${post.id}`);
                      });
                    }}
                  >
                    {isPendingCreate ? (
                      <LoadingDots color="#808080" />
                    ) : (
                      <p>{category.name}</p>
                    )}
                  </Button>
                ))}
              {postCategories.length === 0 && (
                <p>没有目录，您需要等待总管理员添加目录</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
