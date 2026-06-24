import { notFound } from 'next/navigation';

import { verifySession } from '@/lib/dal';
import prisma from '@/prisma/client';

import TemplateEditor from '../_components/template-editor';

export default async function TemmplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ type }, { id }] = await Promise.all([verifySession(), params]);

  const template = await prisma.template.findUnique({
    where: {
      id: decodeURIComponent(id),
    },
  });

  if (!template || type !== 'super_admin') {
    return notFound();
  }

  return (
    <>
      <div className="flex h-full flex-col">
        <TemplateEditor key={template.id} template={template} />
      </div>
    </>
  );
}
