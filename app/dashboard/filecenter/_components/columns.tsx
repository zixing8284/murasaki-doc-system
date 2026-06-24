'use client';

import Link from 'next/link';
import prettyBytes from 'pretty-bytes';

import { DataTableColumnHeader } from '@/components/table/table-column-header';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef, Row } from '@tanstack/react-table';

// Type to define the shape of our data.
import type { PrismaFileWithCategory } from '../page';

export const columns: ColumnDef<PrismaFileWithCategory>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'originalName',
    header: '文件名',
  },
  {
    accessorKey: 'size',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="文件大小" />
    ),
    cell: ({ row }) => {
      const size = parseInt(row.getValue('size'));
      return <div className="text-left">{prettyBytes(size)}</div>;
    },
  },
  {
    accessorKey: 'type',
    header: () => <div className="text-nowrap">文件类型</div>,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('type')}</div>;
    },
  },
  {
    accessorKey: 'categories',
    header: () => <div className="text-nowrap">分类</div>,
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.original.categories.map((category) => category.name).join(', ')}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      // return value.includes(row.getValue(id));

      // row.getValue(id) type: {id: string, name: string}[]
      // value type: string[]
      // so we need to pick row.getValue(id) name to a new array
      // then check if value is included in that array
      const categories = (
        row.getValue(id) as Array<{ id: string; name: string }>
      ).map((category) => category.name);
      return value.some((v: string) => categories.includes(v));
    },
  },
  {
    accessorKey: '预览',
    header: () => <div className="text-nowrap">预览</div>,
    cell: ({ row }) => {
      return PreviewCell({ row });
    },
  },
  {
    accessorKey: 'download',
    header: () => <div className="text-nowrap">下载</div>,
    cell: ({ row }) => {
      return (
        <a
          href={`/file/${row.original.storageName}`}
          className=""
          download
          // Prevent triggering the holy-loader when clicking
          onClick={(e) => {
            e.nativeEvent.stopImmediatePropagation();
          }}
        >
          <span className="">下载</span>
        </a>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: () => <div className="text-nowrap text-end">上传时间</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right">
          {new Date(row.original.createdAt).toLocaleString()}
        </div>
      );
    },
  },
];

const PreviewCell = ({ row }: { row: Row<PrismaFileWithCategory> }) => {
  const file = row.original;
  let href = '';
  if (file.type.startsWith('image/')) {
    href = `/file/${file.storageName}`;
  } else if (file.type.startsWith('application/pdf')) {
    href = `/file/${file.storageName}`;
  }

  return href ? (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      预览
    </Link>
  ) : null;
};
