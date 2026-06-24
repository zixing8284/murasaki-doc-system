import { useTransition } from 'react';

import LoadingDots from '@/app/ui/icons/loading-dots';
import { Button } from '@/components/ui/button';
import { publishPost } from '@/lib/actions/post.action';
import { cn } from '@/lib/utils';

import type { Post } from '@prisma/client';
export function PublishPostButton({ post }: { post: Post }) {
  const [isPendingSaving, startTransitionSaving] = useTransition();

  return (
    <>
      <Button
        onClick={() => {
          startTransitionSaving(async () => {
            await publishPost(post);
          });
        }}
        className={cn(
          'flex w-24 items-center justify-center space-x-2 rounded-lg border text-sm transition-all focus:outline-none',
          isPendingSaving
            ? 'cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300'
            : 'border border-black bg-white text-black hover:bg-black hover:text-white active:bg-stone-100 dark:border-stone-200 dark:bg-black dark:text-white dark:hover:border-stone-700 dark:hover:bg-white dark:hover:text-black dark:active:bg-stone-800',
        )}
        disabled={isPendingSaving}
      >
        {isPendingSaving ? <LoadingDots /> : <p>发布</p>}
      </Button>
    </>
  );
}
