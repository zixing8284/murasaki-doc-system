'use client';

import { useState, useTransition } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { PlateEditor } from '@/components/editor/plate-editor';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { nowUpdatePost } from '@/lib/actions/post.action';

import { PublishPostButton } from './buttons';

import type { Value } from 'platejs';
import type { Post } from '@prisma/client';

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

export default function PostEditor({
  post,
  preview,
}: {
  post: Post;
  preview: boolean;
}) {
  const [data, setData] = useState({
    ...post,
    content: post.content ?? emptyValueStrct,
  });

  let [isPendingSaving, startTransitionSaving] = useTransition();

  const [savedTime, setSavedTime] = useState(() => new Date().toLocaleTimeString());

  const debounced = useDebouncedCallback((value: Value) => {
    if (JSON.stringify(value) === post.content) {
      return;
    }

    console.log('debounce...');

    startTransitionSaving(async () => {
      // do some saving
      const content = JSON.stringify(value);
      await nowUpdatePost({
        ...data,
        content,
      });
      setSavedTime(new Date().toLocaleTimeString());
    });
  }, 2000);

  return (
    <>
      <div className="container block items-end justify-between gap-2 space-y-2 py-4 sm:flex-row sm:space-y-0 md:flex">
        <div className="mb-1 flex flex-1 shrink-0 flex-col space-y-3">
          <Input
            type="text"
            placeholder="记录标题"
            defaultValue={post?.title || ''}
            autoFocus
            minLength={2}
            maxLength={30}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="dark:placeholder-text-600 font-cal w-full border-none px-0 text-2xl text-muted-foreground shadow-none placeholder:text-stone-400 focus:outline-none focus:ring-0"
            disabled={preview || isPendingSaving}
          />
        </div>
        {!preview && (
          <div className="ml-auto flex shrink-0 justify-end space-x-2">
            <Badge variant="secondary" suppressHydrationWarning>
              {isPendingSaving
                ? '保存中...'
                : `已保存@ ${savedTime}`}
            </Badge>
            <div>
              <PublishPostButton post={data} />
            </div>
          </div>
        )}
      </div>

      <div className="container">
        <Separator />
        <PlateEditor
          value={JSON.parse(post?.content || emptyValueStrct)}
          onChange={(value) => {
            setData({ ...data, content: JSON.stringify(value) });
            debounced(value);
          }}
          readOnly={preview}
          variant={preview ? 'viewer' : 'default'}
          className="z-auto min-h-150 px-24 py-16"
          autoFocus={!preview}
        />
      </div>
    </>
  );
}
