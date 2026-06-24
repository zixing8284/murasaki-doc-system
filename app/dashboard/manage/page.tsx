import { Separator } from '@/components/ui/separator';
import {
  CreatePostButton,
  CreatePostFromTemplateButton,
} from './_components/buttons';
import PostTimeLine from './_components/post-timeline';
import prisma from '@/prisma/client';
import { verifySession } from '@/lib/dal';

export const metadata = {
  title: '日常管理',
};

export default async function ManagePage() {
  const [{ userId }, postCategories, templates] = await Promise.all([
    verifySession(),
    prisma.postCategory.findMany({}),
    prisma.template.findMany(),
  ]);

  const userNewestPosts = await prisma.post.findMany({
    where: {
      authorId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  });

  return (
    <>
      <div>
        <div className="relative ml-4 mr-4 flex h-full min-w-0 flex-col md:ml-10 md:mr-5">
          <div className="flex h-max flex-col justify-start gap-3 pb-4 sm:flex-row">
            <CreatePostButton postCategories={postCategories} />
            <CreatePostFromTemplateButton
              postCategories={postCategories}
              templates={templates}
            />
          </div>

          <div className="container space-y-6">
            <p className="mb-4 mt-14 text-lg text-muted-foreground">最新记录</p>
            <Separator />

            {userNewestPosts.map((post) => (
              <PostTimeLine key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
