'use client';

import React from 'react';

import { DataTableFacetedFilter } from '@/components/table/data-table-faceted-filter';
import { DataTablePagination } from '@/components/table/table-pagination';
import { DataTableViewOptions } from '@/components/table/table-toggle-column';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArchiveIcon } from '@radix-ui/react-icons';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';

import type { PrismaFileWithCategory } from '../page';

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[];
//   data: TData[];
// }

const columnIdNameMap = {
  size: '文件大小',
  type: '文件类型',
  originalName: '文件名',
};

interface DataTableProps {
  data: PrismaFileWithCategory[];
  columns: ColumnDef<PrismaFileWithCategory>[];
  fileCats: string[];
}

export const DataTable = ({ data, columns, fileCats }: DataTableProps) => {
  // export function DataTable<TData, TValue>({
  //   columns,
  //   data,
  // }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const fileCatsMap = fileCats.map((cat) => ({
    value: cat,
    label: cat,
    icon: ArchiveIcon,
  }));

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="px-1">
      <div className="flex flex-1 items-center space-x-2 py-4">
        <Input
          placeholder="过滤文件..."
          value={
            (table.getColumn('originalName')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('originalName')?.setFilterValue(event.target.value)
          }
          className="h-8 max-w-sm"
        />
        {table.getColumn('categories') && (
          <DataTableFacetedFilter
            column={table.getColumn('categories')}
            title="分类"
            options={fileCatsMap}
          />
        )}

        <div className="ml-auto flex flex-1 flex-row justify-end gap-2">
          <DataTableViewOptions
            table={table}
            columnIdNameMap={columnIdNameMap}
          />
        </div>
      </div>
      <div className="my-2 rounded-md border">
        <Table className="bg-background/30">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className=""
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  没有文件
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="py-2">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
};
