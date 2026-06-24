'use client';

import { useState } from 'react';
import AnnEditor from '@/components/ann-editor/ann-editor';

export default function AddAnn() {
  const [openEditor, setOpenEditor] = useState(false);

  return !openEditor ? (
    <div className="relative h-20 overflow-hidden rounded-lg border border-dotted border-gray-500 opacity-75">
      <div className="absolute inset-0 flex items-center justify-center text-center text-muted-foreground">
        <button
          type="button"
          className="text-lg font-medium"
          onClick={() => {
            setOpenEditor(true);
          }}
        >
          管理员可以在这里添加面向全体账号的公告信息
        </button>
      </div>
    </div>
  ) : (
    <AnnEditor />
  );
}
