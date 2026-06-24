'use server';

import { hash } from 'bcrypt-ts';
import { revalidatePath } from 'next/cache';

import { checkSuperAdmin } from '@/lib/dal';
import { ReturnState } from '@/lib/definitions';
import {
  CreateDepartmentFormSchema,
  UpdateSuperAdminAccountFormSchema,
} from '@/lib/schemas';
import prisma from '@/prisma/client';

/*
 * if you use onSubmit in react-hook-form:
 * const onSubmit = async (data: z.infer<typeof UpdateFormSchema>) => formAction(data);
 */
// export const updateSuperAdminAccount = async (
//   prevState: any,
//   updateFormData: z.infer<typeof UpdateSuperAdminAccountFormSchema>,
// ) => {
//   const validatedFields = UpdateSuperAdminAccountFormSchema.safeParse(updateFormData);
//  ...
// };

export const updateSuperAdminAccount = async (
  prevState: any,
  updateFormData: FormData,
) => {
  /* artifical delay */
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const admin = await checkSuperAdmin();

  const rawFormData = {
    name: updateFormData.get('name'),
    password: updateFormData.get('password'),
    confirmPassword: updateFormData.get('confirmPassword'),
  };
  const validatedFields =
    UpdateSuperAdminAccountFormSchema.safeParse(rawFormData);
  if (!validatedFields.success) {
    throw new Error('Error updating account');
  }
  const hashedPassword = await hash(validatedFields.data.password, 5);

  try {
    const user = await prisma.user.update({
      where: { id: admin.id as number },
      data: {
        name: validatedFields.data.name,
        password: hashedPassword,
      },
    });
    return {
      success: true,
    };
  } catch (error) {
    throw new Error('Error updating account');
  }
};

export const createDepartmentAndAccount = async (
  prevState: any,
  createFormData: FormData,
): Promise<ReturnState> => {
  /* artifical delay */
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const admin = await checkSuperAdmin();

  const rawFormData = {
    departname: createFormData.get('departname'),
    username: createFormData.get('username'),
    password: createFormData.get('password'),
  };

  const validatedFields = CreateDepartmentFormSchema.safeParse(rawFormData);
  if (!validatedFields.success) {
    throw new Error('error creating department');
  }
  const hashedPassword = await hash(validatedFields.data.password, 5);

  try {
    await prisma.department.create({
      data: {
        name: validatedFields.data.departname,
        parentId: admin.departmentId as number,
        users: {
          create: {
            name: validatedFields.data.username,
            password: hashedPassword,
            type: 'depart_admin',
          },
        },
      },
    });

    revalidatePath('/dashboard/admin/account');
    return {
      success: true,
    };
  } catch (error) {
    throw new Error('error creating department');
  }
};
