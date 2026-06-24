'use client';

import type { Announcement } from '@prisma/client';

import Previewer from '@/components/ann-editor/previewer';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

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

export default function Announcement({ ann }: { ann: Announcement }) {
  const [edit, setEdit] = useState(false);

  return (
    <>
      <Button onClick={() => setEdit(!edit)}>
        {edit ? '取消编辑' : '编辑'}
      </Button>

      {edit ? (
        <div></div>
      ) : (
        <Previewer value={JSON.parse(ann?.content || emptyValueStrct)} />
      )}
    </>
  );
}
