'use client';

import { useRef, useTransition } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { PlateEditor } from '@/components/editor/plate-editor';

import type { Value } from 'platejs';
import { Button } from '@/components/ui/button';
import { createAnnouncement } from '@/lib/actions/ann.action';

import LoadingDots from '@/app/ui/icons/loading-dots';

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

export default function AnnProduce() {
  let [isPendingSaving, startTransitionSaving] = useTransition();

  const dataRef = useRef<Value | undefined>(undefined);

  const debounced = useDebouncedCallback((value: Value) => {
    startTransitionSaving(async () => {
      // do some saving
      const content = JSON.stringify(value);
    });
  }, 2000);

  return (
    <div className="relative overflow-hidden rounded-md bg-next shadow-sunlight dark:shadow-hairo">
      <div className="relative p-6">
        <h4 className="text-lg font-semibold">公告发布</h4>
        <p className="text-muted-foreground">
          您可以在这里添加面向全体账号的公告信息
        </p>

        <div className="pt-6">
          <PlateEditor
            value={JSON.parse(emptyValueStrct)}
            onChange={(value) => {
              dataRef.current = value;
              debounced(value);
            }}
            className="z-auto min-h-150 px-24 py-16"
            autoFocus
          />
        </div>
      </div>
      <footer className="flex min-h-14 items-center border-t border-sunlight bg-muted px-6 py-3 text-sm leading-6 text-muted-foreground dark:border-hairo">
        <div className="flex items-center"></div>
        <div className="ml-auto flex items-center justify-end">
          <Button
            type="submit"
            disabled={isPendingSaving}
            onClick={() => {
              startTransitionSaving(async () => {
                await createAnnouncement(JSON.stringify(dataRef.current));
              });
            }}
          >
            {isPendingSaving ? <LoadingDots /> : <p>发布公告</p>}
          </Button>
        </div>
      </footer>
    </div>
  );
}
