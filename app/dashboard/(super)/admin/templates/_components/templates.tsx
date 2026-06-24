'use client';

import { useState } from 'react';

import {
  CreateTemplateButton,
  DeleteTemplateButton,
  EditTemplateButton,
  UpdateTemplateMetadataButton,
} from '@/app/dashboard/(custom-layout)/admin/templates/_components/buttons';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

import type { Template } from '@prisma/client';

const appText = new Map<string, string>([
  ['all', '所有模板'],
  ['published', '已发布'],
  ['notPublished', '未发布'],
]);

export default function Templates({ templates }: { templates: Template[] }) {
  const [tempType, setTempType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTemplates = templates
    .filter((template) =>
      tempType === 'published'
        ? template.published
        : tempType === 'notPublished'
          ? !template.published
          : true,
    )
    .filter((template) =>
      template.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  return (
    <>
      <div className="my-4 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row lg:my-4">
          <Input
            placeholder="过滤模板..."
            className="h-9 w-full lg:w-40 xl:w-62.5"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={tempType} onValueChange={setTempType}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue>{appText.get(tempType)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有模板</SelectItem>
              <SelectItem value="published">已发布</SelectItem>
              <SelectItem value="notPublished">未发布</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <CreateTemplateButton className="w-full lg:w-auto" />
      </div>
      <Separator className="shadow-none" />
      {filteredTemplates.length > 0 ? (
        <ul className="no-scrollbar grid gap-4 pb-16 pt-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {filteredTemplates.map((template) => (
            <li
              key={template.id}
              className="rounded-lg border p-4 hover:shadow-md"
            >
              <div className="mb-8 flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted p-2">
                  {template.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex gap-1">
                  <UpdateTemplateMetadataButton template={template} />
                  <EditTemplateButton id={template.id} />
                  <DeleteTemplateButton id={template.id} />
                </div>
              </div>
              <div>
                <h2 className="mb-1 font-semibold">{template.name}</h2>
                <p className="line-clamp-2 text-muted-foreground">
                  {template.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="m-auto flex flex-1 flex-col items-center space-x-4 pt-8">
          <h3 className="font-cal text-lg">没有模板</h3>

          <p className="text-base text-muted-foreground">
            您还没有任何模板，开始创建一个新模板吧！
          </p>
        </div>
      )}
    </>
  );
}
