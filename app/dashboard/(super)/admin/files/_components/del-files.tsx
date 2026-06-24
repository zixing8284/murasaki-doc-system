import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import LoadingDots from '@/app/ui/icons/loading-dots';
import { Button } from '@/components/ui/button';
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
import { delFiles } from '@/lib/actions/file.action';

import type { Table, Row } from '@tanstack/react-table';
import type { PrismaFileWithCategory } from './file-tab';

type DelFilesButtonProps = {
  table: Table<PrismaFileWithCategory>;
};

export function DelFilesButton({ table }: DelFilesButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const files = selectedRows.map((row) => row.original);
  const selectedRowIds = files.map((file) => file.id);

  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            disabled={selectedRows.length === 0}
          >
            删除文件
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>删除文件</DialogTitle>
            <DialogDescription>
              您确定要删除文件吗？此操作无法撤销。
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
                    await delFiles(selectedRowIds);
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
    </>
  );
}
