'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

import {
  createTemplate,
  publishTemplate,
  updateTemplateMetadata,
  deleteTemplate,
} from '@/lib/actions/template.action';
import LoadingDots from '@/app/ui/icons/loading-dots';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import type { Template } from '@prisma/client';

export function CreateTemplateButton({ className }: { className?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <Button
        className={cn('border', className, {
          'cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300':
            isPending,
        })}
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const template = await createTemplate();
            router.refresh();
            router.push(`/dashboard/admin/templates/${template.id}`);
          })
        }
      >
        {isPending ? <LoadingDots color="#808080" /> : <p>新建模板</p>}
      </Button>
    </>
  );
}

export function DeleteTemplateButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            删除
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>删除模板</DialogTitle>
            <DialogDescription>
              您确定要删除此模板吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                取消
              </Button>
            </DialogClose>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2"></div>
              <Button
                className="px-3"
                type="submit"
                variant="destructive"
                onClick={async () => {
                  startTransition(async () => {
                    await deleteTemplate(id);
                    router.refresh();
                    router.push('/dashboard/admin/templates');
                    toast.success('模板已删除');
                  });
                }}
              >
                {isPending ? <LoadingDots color="#808080" /> : '删除'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function EditTemplateButton({ id }: { id: string }) {
  return (
    <>
      <Button variant="outline" size="sm" asChild>
        <Link href={`/dashboard/admin/templates/${id}`}>编辑</Link>
      </Button>
    </>
  );
}

export function UpdateTemplateMetadataButton({
  template,
}: {
  template: Template;
}) {
  const [isPendingPublishing, startTransitionPublishing] = useTransition();

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className={cn(
          template.published
            ? 'border bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground',
          isPendingPublishing
            ? 'cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300'
            : '',
        )}
        onClick={() => {
          const formData = new FormData();
          formData.append('published', String(!template.published));
          startTransitionPublishing(async () => {
            await updateTemplateMetadata(
              formData,
              template.id,
              'published',
            ).then(() => {
              toast.success(
                template.published ? '已取消发布' : '已发布',
              );
            });
          });
        }}
      >
        {isPendingPublishing ? (
          <LoadingDots />
        ) : (
          <p>{template.published ? '已发布' : '未发布'}</p>
        )}
      </Button>
    </>
  );
}

export function PublishTemplateButton({ template }: { template: Template }) {
  const [isPendingSaving, startTransitionSaving] = useTransition();

  return (
    <>
      <Button
        onClick={() => {
          startTransitionSaving(async () => {
            await publishTemplate(template);
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
