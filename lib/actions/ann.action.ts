'use server';

import { redirect } from 'next/navigation';
import { verifySession } from '@/lib/dal';
import { AnnouncementSchema } from '../schemas';
import prisma from '@/prisma/client';
import { revalidatePath } from 'next/cache';

export const createAnnouncement = async (data: any) => {
  const { userId, type } = await verifySession();

  if (type !== 'super_admin') {
    redirect('/dashboard/reject');
  }

  const validatedFields = AnnouncementSchema.safeParse({
    content: data,
  });

  if (!validatedFields.success) {
    throw new Error('Invalid data');
  }

  const { content } = validatedFields.data;

  try {
    await prisma.announcement.create({
      data: {
        content,
        authorId: userId,
      },
    });

    revalidatePath('/dashboard/manage/org_public');
  } catch (error) {
    throw new Error('Error publishing post');
  }

  redirect('/dashboard/manage/org_public');
};
