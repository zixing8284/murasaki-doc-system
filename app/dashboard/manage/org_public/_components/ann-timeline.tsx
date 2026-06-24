import type { Announcement } from '@prisma/client';

import Link from 'next/link';
import { PlateEditor } from '@/components/editor/plate-editor';

export default function AnnTimeLine({ ann }: { ann: Announcement }) {
  return (
    <Link
      href={`/dashboard/manage/org_public/${ann.id}`}
      className="group block space-y-1 rounded-md border border-transparent p-2 transition-colors hover:border-sunlight hover:bg-muted dark:hover:border-hairo"
    >
      <div className="text-xs text-muted-foreground">
        {new Date(ann.createdAt).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
      <div className="group-hover:text-primary">
        <PlateEditor
          value={ann.content ? JSON.parse(ann.content) : null}
          readOnly
          variant="viewer"
          containerClassName="*:cursor-pointer"
          className="h-max min-h-max w-full border-none bg-transparent px-0 text-sm text-foreground shadow-none focus:outline-none focus:ring-0"
        />
      </div>
    </Link>
  );
}
