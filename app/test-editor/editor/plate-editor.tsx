'use client';

import { useState } from 'react';

import { PlateEditor } from '@/components/editor/plate-editor';

import type { Value } from 'platejs';

const initialValue: Value = [
  {
    type: 'h1',
    children: [{ text: 'Heading 1' }],
  },
  {
    type: 'p',
    children: [{ text: 'Hello, World!' }],
  },
];

export default function ManagerEditor() {
  const [value, setValue] = useState<Value>(initialValue);

  return (
    <PlateEditor
      value={value}
      onChange={setValue}
      className="z-auto px-[96px] py-16"
      autoFocus
    />
  );
}
