'use server';

import { exec } from 'child_process';
import fs from 'fs';
import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import path from 'path';
import { promisify } from 'util';

import { checkSuperAdmin } from '@/lib/dal';
import {
  uploadFileFormSchema,
  CreateFileCategoryFormSchema,
} from '@/lib/schemas';
import prisma from '@/prisma/client';

type State = {
  errors?: {
    files?: string[];
  };
  message?: string | null;
  status?: string;
};

const writeFile = promisify(fs.writeFile);
const execPromise = promisify(exec);

function createDirectory(dirPath: string) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    return dirPath;
  } catch (error) {
    return null;
  }
}

function sanitizeName(name: string) {
  return (
    name
      // remove all non-word characters except spaces and hyphens
      .replace(/[^\w\s-]/g, '')
      // replace all spaces with underscores
      .replace(/\s/g, '_')
  );
}

async function writeFileAndMove(
  tempFilePath: string,
  fileBuffer: Buffer,
  finalDir: string,
  fileName: string,
) {
  await writeFile(tempFilePath, fileBuffer);
  const storageName = `${nanoid()}${path.extname(fileName)}`;
  const finalFilePath = path.join(finalDir, storageName);
  await execPromise(`mv ${tempFilePath} ${finalFilePath}`);
  return storageName;
}

/*
  General advice for handling file uploads:
  1. Always validate the file type and size before processing.
  2. Consider using a library like multer for handling file uploads if you're using Express.
  3. Always handle errors that may occur during the file upload process.
*/
export async function saveFiles(prevState: State, formData: FormData) {
  const admin = await checkSuperAdmin();

  //  artically slow down the process 3s
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // console.log('file', formData.getAll('file-upload') as File[]);
  console.log('formData', Object.fromEntries(formData.entries()));

  const validatedFields = uploadFileFormSchema.safeParse({
    cat: formData.get('cat') as string,
    files: formData.getAll('file-upload') as File[],
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '上传失败，文件验证未通过！',
    };
  }

  const files = validatedFields.data.files;
  const validatedCat = validatedFields.data.cat;
  const tempDir = createDirectory(path.join(process.cwd(), 'public', 'tmp'));
  const finalDir = createDirectory(
    path.join(process.cwd(), 'public', process.env.FILE_PATH!),
  );

  if (!tempDir || !finalDir) {
    return {
      message: 'Create directory failed!',
    };
  }

  try {
    for (const file of files) {
      const fileBuffer = await file.arrayBuffer();
      const sanitizeFileName = sanitizeName(file.name);
      const tempFilePath = path.join(tempDir, sanitizeFileName);

      const storageName = await writeFileAndMove(
        tempFilePath,
        Buffer.from(fileBuffer),
        finalDir,
        file.name,
      );
      const originalName = Buffer.from(file.name, 'latin1').toString('utf8');

      await prisma.file.create({
        data: {
          originalName,
          storageName,
          path: process.env.FILE_PATH!,
          size: file.size,
          type: file.type,

          categories: {
            connect: {
              name: validatedCat,
            },
          },
          user: {
            connect: {
              id: admin?.id,
            },
          },
        },
      });
    }

    revalidatePath('/dashboard/admin/files');

    return {
      status: 'success',
    };
  } catch (error) {
    throw new Error('Error saving file');
  }
}

export async function deleteFileCategory(name: string) {
  await checkSuperAdmin();

  try {
    await prisma.fileCategory.delete({
      where: {
        name,
      },
    });

    revalidatePath('/dashboard/admin/files');
  } catch (error) {
    throw new Error('Error deleting file category');
  }
}

export async function createFileCategory(prevState: any, formData: FormData) {
  await checkSuperAdmin();

  const rowFormData = {
    name: formData.get('name'),
  };

  const validatedFields = CreateFileCategoryFormSchema.safeParse(rowFormData);

  if (!validatedFields.success) {
    throw new Error('Error creating file category');
  }

  const existingCategory = await prisma.fileCategory.findUnique({
    where: {
      name: validatedFields.data.name,
    },
  });

  if (existingCategory) {
    // return {
    //   message: 'Category already exists!',
    // };
    throw new Error('Category already exists!');
  }

  try {
    await prisma.fileCategory.create({
      data: {
        name: validatedFields.data.name,
      },
    });

    revalidatePath('/dashboard/admin/files');

    return {
      success: true,
    };
  } catch (error) {
    throw new Error('Error creating file category');
  }
}

export async function delFile(id: string) {
  await checkSuperAdmin();

  const file = await prisma.file.findUnique({
    where: {
      id,
    },
  });

  if (!file) {
    // return {
    //   message: 'File not found!',
    // };
    throw new Error('File not found!');
  }

  try {
    await prisma.file.delete({
      where: {
        id,
      },
    });

    const filePath = path.join(
      process.cwd(),
      'public',
      'file',
      file.storageName,
    );

    // if file exists, delete it
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    revalidatePath('/dashboard/admin/files');
  } catch (error) {
    throw new Error('Error deleting file');
  }
}

export async function delFiles(ids: string[]) {
  await checkSuperAdmin();

  try {
    const files = await prisma.file.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    if (files.length === 0) {
      throw new Error('Files not found!');
    }

    for (const file of files) {
      await prisma.file.delete({
        where: {
          id: file.id,
        },
      });

      const filePath = path.join(
        process.cwd(),
        'public',
        'file',
        file.storageName,
      );

      // if file exists, delete it
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    revalidatePath('/dashboard/admin/files');
  } catch (error) {
    throw new Error('Error deleting files');
  }
}

export async function saveTemplateImage(formData: FormData) {
  await checkSuperAdmin();

  const imageFile = formData.get('image-upload') as File;
  const filename = `${nanoid()}.${imageFile.type.split('/')[1]}`;

  const dir = path.join(process.cwd(), 'public', 'template');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, filename);
  await writeFile(filePath, Buffer.from(await imageFile.arrayBuffer()));

  return `/template/${filename}`;
}
