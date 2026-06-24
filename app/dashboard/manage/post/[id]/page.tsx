import { notFound } from 'next/navigation';
import { verifySession } from '@/lib/dal';

import prisma from '@/prisma/client';
import PostEditor from '../../_components/post-editor';

export default async function PostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    preview?: string;
  }>;
}) {
  const [{ userId }, { id }, { preview: previewParam }] = await Promise.all([
    verifySession(),
    params,
    searchParams,
  ]);

  const post = await prisma.post.findUnique({
    where: {
      id: decodeURIComponent(id),
    },
  });

  const preview = previewParam === 'true';

  if (!post || post.authorId !== userId) {
    return notFound();
  }

  return (
    <>
      <div className="flex h-full flex-col">
        <PostEditor post={post} preview={preview} />
      </div>
    </>
  );
}
