'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { checkSuperAdmin } from '@/lib/dal';
import { TemplateSchema } from '@/lib/schemas';
import prisma from '@/prisma/client';

import type { Template } from '@prisma/client';

export const deleteTemplate = async (id: string) => {
  await checkSuperAdmin();

  try {
    await prisma.template.delete({
      where: {
        id,
      },
    });

    revalidatePath('/dashboard/admin/templates');
  } catch (error) {
    throw new Error('Error deleting template');
  }
};

export const createTemplate = async () => {
  const admin = await checkSuperAdmin();

  // artifical delay
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const validatedFields = TemplateSchema.safeParse({
    name: undefined,
    description: undefined,
    content: '',
    published: false,
  });

  if (!validatedFields.success) {
    throw new Error('Invalid data');
  }

  const { name, description, content, published } = validatedFields.data;

  try {
    const template = await prisma.template.create({
      data: {
        authorId: admin.id as number,
        name,
        description,
        content,
        published,
      },
    });

    revalidatePath('/dashboard/admin/templates');

    return template;
  } catch (error) {
    throw new Error('Error creating template');
  }
};

export const updateTemplateMetadata = async (
  formData: FormData,
  id: string,
  key: string,
) => {
  await checkSuperAdmin();

  const value = formData.get(key) as string;

  try {
    const response = await prisma.template.update({
      where: { id },
      data: {
        [key]: key === 'published' ? value === 'true' : value,
      },
    });

    revalidatePath('/dashboard/admin/templates');
    return response;
  } catch (error) {
    throw new Error('Error updating template metadata');
  }
};

export const publishTemplate = async (template: Template) => {
  await checkSuperAdmin();

  const isUniqueTemplate = await prisma.template.findUnique({
    where: {
      id: template.id,
    },
  });
  if (!isUniqueTemplate) {
    throw new Error('Template not found');
  }
  const validatedFields = TemplateSchema.safeParse({
    name: template.name,
    description: template.description,
    content: template.content,
    published: true,
  });
  if (!validatedFields.success) {
    throw new Error('Invalid data');
  }

  const { name, description, content, published } = validatedFields.data;

  try {
    await prisma.template.update({
      where: {
        id: template.id,
      },
      data: {
        name,
        description,
        content,
        published,
      },
    });

    revalidatePath('/dashboard/admin/templates');
  } catch (error) {
    throw new Error('Error publishing template');
  }

  redirect('/dashboard/admin/templates');
};

export const nowUpdateTemplate = async (template: Template) => {
  await checkSuperAdmin();

  // artifical delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const isUniqueTemplate = await prisma.template.findUnique({
    where: {
      id: template.id,
    },
  });
  if (!isUniqueTemplate) {
    throw new Error('Template not found');
  }
  const validatedFields = TemplateSchema.safeParse({
    name: template.name,
    description: template.description,
    content: template.content,
    // set to false cause we are editing the template
    published: false,
  });
  if (!validatedFields.success) {
    throw new Error('Invalid data');
  }

  const { name, description, content, published } = validatedFields.data;

  try {
    const response = await prisma.template.update({
      where: {
        id: template.id,
      },
      data: {
        name,
        description,
        content,
        published,
      },
    });
  } catch (error) {
    throw new Error('Error updating template');
  }
};
