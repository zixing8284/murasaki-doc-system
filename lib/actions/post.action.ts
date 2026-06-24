'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { checkSuperAdmin, verifySession } from '@/lib/dal';
import {
  CreatePostCategoryFormSchema,
  PostFromTemplateFormSchema,
  PostSchema,
} from '@/lib/schemas';
import prisma from '@/prisma/client';

import type { Post } from '@prisma/client';

export async function deletePostCategory(name: string) {
  // artificial delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  await checkSuperAdmin();

  const existingCategory = await prisma.postCategory.findUnique({
    where: {
      name: name,
    },
  });

  if (!existingCategory) {
    throw new Error('Category does not exist');
  }

  try {
    await prisma.postCategory.delete({
      where: {
        name: name,
      },
    });

    revalidatePath('/dashboard/admin');
    return {
      success: true,
    };
  } catch (error) {
    throw new Error('Error deleting post category');
  }
}

export async function createPostCategory(prev: any, formData: FormData) {
  // artificial delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  await checkSuperAdmin();

  // const rowFormData = Object.fromEntries(formData.entries());
  const rowFormData = {
    name: formData.get('name'),
  };

  const validatedFields = CreatePostCategoryFormSchema.safeParse(rowFormData);

  if (!validatedFields.success) {
    throw new Error('Error creating post category');
  }

  const existingCategory = await prisma.postCategory.findUnique({
    where: {
      name: validatedFields.data.name,
    },
  });

  if (existingCategory) {
    throw new Error('Category already exists');
  }

  try {
    await prisma.postCategory.create({
      data: {
        name: validatedFields.data.name,
      },
    });

    revalidatePath('/dashboard/admin');
    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    throw new Error('Error creating post category');
  }
}

export const nowUpdatePost = async (post: Post) => {
  const { userId } = await verifySession();

  if (post.authorId !== userId) {
    redirect('/dashboard/reject');
  }

  const title = typeof post.title === 'string' ? post.title.trim() || '无标题记录' : '无标题记录';
  const content = typeof post.content === 'string' && post.content
    ? post.content
    : JSON.stringify([{ children: [{ text: '' }], type: 'p' }]);

  try {
    await prisma.post.update({
      where: { id: post.id },
      data: {
        title,
        content,
      },
    });
  } catch (error) {
    throw new Error('Error updating post');
  }
};

export const publishPost = async (post: Post) => {
  const { userId } = await verifySession();

  if (post.authorId !== userId) {
    redirect('/dashboard/reject');
  }

  const title = typeof post.title === 'string' ? post.title.trim() || '无标题记录' : '无标题记录';
  const content = typeof post.content === 'string' && post.content
    ? post.content
    : JSON.stringify([{ children: [{ text: '' }], type: 'p' }]);

  try {
    await prisma.post.update({
      where: { id: post.id },
      data: {
        title,
        content,
        published: true,
      },
    });

    revalidatePath('/dashboard/manage');
  } catch (error) {
    console.error('Error publishing post:', error);
    throw new Error('Error publishing post');
  }

  redirect('/dashboard/manage');
};

export async function createPostFromTemplate({
  templateId,
  categoryId,
  carriedContent,
}: {
  templateId: string;
  categoryId: string;
  carriedContent: string | undefined;
}) {
  // artificial delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { userId } = await verifySession();

  const validatedFields = PostFromTemplateFormSchema.safeParse({
    title: undefined,
    content: carriedContent,
    templateId,
    categoryId,
    published: false,
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error);
    throw new Error('Invalid data');
  }

  const {
    title,
    content,
    published,
    categoryId: newCategoryId,
  } = validatedFields.data;

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        published,
        authorId: userId,
        categories: {
          connect: {
            id: categoryId,
          },
        },
      },
    });
    revalidatePath('/dashboard/manage');
    return post;
  } catch (error) {
    throw new Error('Error creating post');
  }
}

export async function createPost({ categoryId }: { categoryId: string }) {
  // artificial delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { userId } = await verifySession();

  console.log('Creating post with:', { userId, categoryId });

  const validatedFields = PostSchema.safeParse({
    title: undefined,
    content: '',
    published: false,
  });

  if (!validatedFields.success) {
    throw new Error('Invalid data');
  }

  const { title, content, published } = validatedFields.data;

  // Verify the user exists
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }

  // Verify the category exists
  const category = await prisma.postCategory.findUnique({ where: { id: categoryId } });
  if (!category) {
    throw new Error(`Category with id ${categoryId} not found`);
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        published,
        authorId: userId,
        categories: {
          connect: {
            id: categoryId,
          },
        },
      },
    });

    revalidatePath('/dashboard/manage');
    return post;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error(`Error creating post: ${error}`);
  }
}
