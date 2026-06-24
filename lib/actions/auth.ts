'use server';

import { compare } from 'bcrypt-ts';
import prisma from '@/prisma/client';
import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { SigninFormSchema } from '@/lib/schemas';

export type FormState =
  | {
      errors?: {
        name?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export async function login(state: FormState, formData: FormData) {
  const validatedFields = SigninFormSchema.safeParse({
    name: formData.get('name'),
    password: formData.get('password'),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { name, password } = validatedFields.data;

  // artificial delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user = await prisma.user.findFirst({
    where: {
      name,
    },
  });

  if (!user) {
    return {
      message: '用户不存在',
    };
  }
  const passwordsMatch = await compare(password, user.password);

  if (!passwordsMatch) {
    return {
      message: '密码错误',
    };
  }

  const { password: _, email: __, ...safeUser } = user;

  await createSession(safeUser);
  redirect('/dashboard');
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}

function isValidUserType(userType: string) {
  return ['super_admin', 'developer', null].includes(userType);
}
