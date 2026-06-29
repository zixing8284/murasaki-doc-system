'use client';

import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import prettyBytes from 'pretty-bytes';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import LoadingDots from '@/app/ui/icons/loading-dots';
import { DataTableColumnHeader } from '@/components/table/table-column-header';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { delFile } from '@/lib/actions/file.action';
import { buildFileAssetUrl } from '@/lib/file-path';
import { ColumnDef, Row, Table } from '@tanstack/react-table';

// Type to define the shape of our data.
import type { PrismaFileWithCategory } from './file-tab';

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
      return <div className="pl-2">{prettyBytes(size)}</div>;
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
    id: 'actions',
    cell: ({ row, table }) => {
      return <ActionCell row={row} table={table} />;
    },
  },
];

const PreviewCell = ({ row }: { row: Row<PrismaFileWithCategory> }) => {
  const file = row.original;
  let href = '';
  if (file.type.startsWith('image/')) {
    href = buildFileAssetUrl(file.path, file.storageName);
  } else if (file.type.startsWith('application/pdf')) {
    href = buildFileAssetUrl(file.path, file.storageName);
  }

  return href ? (
    // <Link href={href} target="_blank" rel="noopener noreferrer">
    <Link href={href} target="_blank" rel="">
      预览
    </Link>
  ) : null;
};

const ActionCell = ({
  row,
  table,
}: {
  row: Row<PrismaFileWithCategory>;
  table: Table<PrismaFileWithCategory>;
}) => {
  const file = row.original;

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>动作</DropdownMenuLabel>
          <DialogTrigger asChild>
            <DropdownMenuItem>删除</DropdownMenuItem>
          </DialogTrigger>

          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>删除文件</DialogTitle>
          <DialogDescription>
            您确定要删除此文件吗？此操作无法撤销。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              取消
            </Button>
          </DialogClose>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2"></div>
            <Button
              className="px-3"
              type="submit"
              variant="destructive"
              onClick={() =>
                startTransition(async () => {
                  await delFile(file.id);
                  router.refresh();
                  setOpen(false);
                  // Clear selected rows
                  table.resetRowSelection();
                  toast.success('文件已删除');
                })
              }
            >
              {isPending ? <LoadingDots color="#808080" /> : '删除'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
