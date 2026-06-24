'use client';

import { PlateEditor } from '@/components/editor/plate-editor';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import type { Value } from 'platejs';

export default function Previewer({
  title,
  value,
}: {
  title?: string;
  value: Value;
}) {
  return (
    <>
      <div className="container block items-end justify-between gap-2 space-y-2 py-4 sm:flex-row sm:space-y-0 md:flex">
        {title && (
          <div className="mb-1 flex flex-1 shrink-0 flex-col space-y-3">
            <Input
              type="text"
              placeholder="记录标题"
              defaultValue={title}
              autoFocus
              minLength={2}
              maxLength={30}
              className="dark:placeholder-text-600 font-cal w-full border-none px-0 text-2xl text-muted-foreground shadow-none placeholder:text-stone-400 focus:outline-none focus:ring-0"
              disabled={true}
            />
          </div>
        )}
      </div>

      <div className="container">
        <Separator />
        <PlateEditor
          value={value}
          readOnly
          variant="viewer"
          className="z-auto min-h-150 px-24 py-16"
        />
      </div>
    </>
  );
}
