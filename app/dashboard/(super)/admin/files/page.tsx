import FileTab from './_components/file-tab';
import UploadForm from './_components/upload-form';
import Category from './_components/category';

import prisma from '@/prisma/client';

export default async function FileManagerPage() {
  const fileCategories = await prisma.fileCategory.findMany({});

  return (
    <>
      <div className="relative overflow-hidden rounded-md bg-next shadow-sunlight dark:bg-night dark:shadow-hairo">
        <Category fileCategories={fileCategories} />
      </div>
      <div className="relative overflow-hidden rounded-md bg-next shadow-sunlight dark:bg-night dark:shadow-hairo">
        <UploadForm fileCategories={fileCategories} />
      </div>

      <div className="relative overflow-hidden rounded-md">
        <FileTab />
      </div>
    </>
  );
}
