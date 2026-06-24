'use client';

import Link from 'next/link';
import type { Post } from '@prisma/client';

import { PlateEditor } from '@/components/editor/plate-editor';

export default function PostTimeLine({ post }: { post: Post }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="relative grid flex-1 gap-1 text-sm">
        {/* <div className="relative pl-6 after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-gray-500/20 dark:after:bg-gray-400/20"> */}
        <div className="relative pl-6 after:absolute after:inset-y-0 after:left-0 after:w-px after:border-l after:border-dotted after:border-gray-500/20 after:bg-transparent dark:after:border-gray-400/20 dark:after:bg-transparent">
          <div className="grid gap-8">
            <div className="relative grid gap-2 text-sm">
              <div className="absolute left-0 top-2 z-10 aspect-square w-2 translate-x-[-27.5px] rounded-full bg-gray-400 dark:bg-gray-50" />
              <div className="font-medium">
                <span className="text-xs text-muted-foreground">
                  {new Date(post.createdAt).toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  -
                </span>
                <span className="text-primary">{post.title}</span>
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                <PlateEditor
                  value={post.content ? JSON.parse(post.content) : null}
                  readOnly
                  variant="viewer"
                  className="line-clamp-2 h-max min-h-max w-full text-ellipsis border-none bg-transparent px-0 text-sm text-muted-foreground shadow-none focus:outline-none focus:ring-0"
                />
              </div>
              <div className="flex flex-row items-center gap-2 text-muted-foreground">
                <Link
                  href={`/dashboard/manage/post/${post.id}?preview=true`}
                  className="flex items-center space-x-2 py-2 text-xs hover:text-foreground"
                >
                  查看原文
                </Link>
                <Link
                  href={`/dashboard/manage/post/${post.id}`}
                  className="flex items-center space-x-2 py-2 text-xs hover:text-foreground"
                >
                  编辑
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/*
        <div className="text-xs text-muted-foreground">
          {new Date(post.createdAt).toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
        <h3 className="text-base font-medium">{post.title}</h3>
        <div className="text-sm text-muted-foreground">
          <Plate
            initialValue={post.content ? JSON.parse(post.content) : null}
            plugins={basicNodesPlugins}
            readOnly
          >
            <Editor
              {...basicProps}
              className="line-clamp-1 h-max min-h-max w-full text-ellipsis border-none bg-transparent px-0 text-sm text-muted-foreground shadow-none focus:outline-none focus:ring-0"
            />
          </Plate>
        </div>
        <div className="flex flex-row items-center gap-2 text-muted-foreground">
          <Link
            href={`/dashboard/manage/post/${post.id}?preview=true`}
            className="flex items-center space-x-2 py-2 text-xs hover:text-foreground"
          >
            查看原文
          </Link>
          <Link
            href={`/dashboard/manage/post/${post.id}`}
            className="flex items-center space-x-2 py-2 text-xs hover:text-foreground"
          >
            编辑
          </Link>
        </div> */}
      </div>
    </div>
  );
}
