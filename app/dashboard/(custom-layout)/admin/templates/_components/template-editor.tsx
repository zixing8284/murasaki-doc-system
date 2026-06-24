'use client';

import { useReducer, useTransition } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { PlateEditor } from '@/components/editor/plate-editor';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { nowUpdateTemplate } from '@/lib/actions/template.action';

import { PublishTemplateButton } from './buttons';

import type { Value } from 'platejs';
import type { Template } from '@prisma/client';

const emptyValueStrct = JSON.stringify([
  {
    children: [
      {
        text: '',
      },
    ],
    type: 'p',
  },
]);

export default function TemplateEditor({ template }: { template: Template }) {
  const [data, updateData] = useReducer(
    (prev: Template, partial: Partial<Template>) => ({ ...prev, ...partial }),
    template,
  );

  let [isPendingSaving, startTransitionSaving] = useTransition();

  const debounced = useDebouncedCallback((value: Value) => {
    if (JSON.stringify(value) === template.content) {
      return;
    }

    console.log('debounce...');

    startTransitionSaving(async () => {
      // do some saving
      const content = JSON.stringify(value);
      await nowUpdateTemplate({
        ...data,
        content,
      });
    });
  }, 2000);

  return (
    <>
      <div className="container block items-end justify-between gap-2 space-y-2 py-4 sm:flex-row sm:space-y-0 md:flex">
        <div className="mb-1 flex flex-1 shrink-0 flex-col space-y-3">
          <Input
            type="text"
            placeholder="模板名称"
            defaultValue={template?.name || ''}
            autoFocus
            minLength={2}
            maxLength={30}
            onChange={(e) => updateData({ name: e.target.value })}
            className="dark:placeholder-text-600 font-cal w-full border-none px-0 text-2xl text-muted-foreground shadow-none placeholder:text-stone-400 focus:outline-none focus:ring-0"
          />
          <Input
            placeholder="模板简介"
            minLength={2}
            maxLength={100}
            defaultValue={template?.description || ''}
            onChange={(e) => updateData({ description: e.target.value })}
            className="dark:placeholder-text-600 w-full resize-none border-none px-0 text-muted-foreground shadow-none placeholder:text-stone-400 focus:outline-none focus:ring-0"
          />
        </div>
        <div className="ml-auto flex shrink-0 justify-end space-x-2">
          <Badge variant="secondary" suppressHydrationWarning>
            {isPendingSaving
              ? '保存中...'
              : `已保存@ ${new Date().toLocaleTimeString()}`}
          </Badge>
          <div>
            <PublishTemplateButton template={data} />
          </div>
        </div>
      </div>

      <div className="container">
        <Separator />
        <PlateEditor
          value={JSON.parse(template?.content || emptyValueStrct)}
          onChange={(value) => {
            updateData({ content: JSON.stringify(value) });
            debounced(value);
          }}
          className="z-auto min-h-150 px-24 py-16"
          autoFocus
        />
      </div>
    </>
  );
}
