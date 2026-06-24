'use client';

import { useRef, useTransition } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { PlateEditor } from '@/components/editor/plate-editor';
import { Separator } from '@/components/ui/separator';

import type { Value } from 'platejs';
import type { Announcement } from '@prisma/client';

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

export default function AnnEditor({ ann }: { ann?: Announcement }) {
  let [isPendingSaving, startTransitionSaving] = useTransition();

  const dataRef = useRef<Value | undefined>(undefined);

  const debounced = useDebouncedCallback((value: Value) => {
    startTransitionSaving(async () => {
      // do some saving
      const content = JSON.stringify(value);
    });
  }, 2000);

  return (
    <>
      <div className="container block items-end justify-between gap-2 space-y-2 py-4 sm:flex-row sm:space-y-0 md:flex"></div>

      <div className="container">
        <Separator />
        <PlateEditor
          value={JSON.parse(ann?.content || emptyValueStrct)}
          onChange={(value) => {
            dataRef.current = value;
            debounced(value);
          }}
          className="z-auto min-h-150 px-24 py-16"
          autoFocus
        />
      </div>
    </>
  );
}
