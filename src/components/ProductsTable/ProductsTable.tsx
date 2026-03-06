import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
  PaginationState,
} from '@tanstack/react-table';
import { Product } from '../../types/product.types';
import TablePagination from '../TablePagination/TablePagination';
import { createColumns } from './columns';

import s from './ProductsTable.module.css';


interface ProductsTableProps {
  data: Product[];
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;
  totalItems: number;
  onProductClick?: (product: Product) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
 data,
 sorting,
 onSortingChange,
 pagination,
 onPaginationChange,
 totalItems,
 onProductClick,
}) => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const handleSelectRow = (productId: number, checked: boolean) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(productId);
      } else {
        newSet.delete(productId);
      }
      console.log('Выбранные строки:', Array.from(newSet));
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(data.map(p => p.id)));
      console.log('Выбраны все:', data.map(p => p.id));
    } else {
      setSelectedRows(new Set());
      console.log('Ничего не выбрано');
    }
  };

  const columns = useMemo(
    () =>
      createColumns({
        selectedRows,
        onSelectRow: handleSelectRow,
        onSelectAll: handleSelectAll,
        dataLength: data.length,
      }),
    [selectedRows, data.length]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalItems / pagination.pageSize),
    enableSorting: true,
    enableMultiSort: false,
  });

  return (
    <div className={s.tableContainer}>
      <table className={s.table}>
        <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                style={{ width: header.getSize() }}
                className={`${s.headerCell} ${
                  header.column.getCanSort() ? s.sortable : ''
                }`}
                onClick={header.column.getToggleSortingHandler()}
              >
                <div className={s.headerContent}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getIsSorted() && (
                    <span className={s.sortIcon}>
                        {header.column.getIsSorted() === 'asc' ? ' ↑' : ' ↓'}
                      </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        ))}
        </thead>
        <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            className={s.row}
            onClick={() => onProductClick?.(row.original)}
          >
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className={s.cell}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>

      <TablePagination
        table={table}
        totalItems={totalItems}
        selectedRowsCount={selectedRows.size}
      />
    </div>
  );
};

export default ProductsTable;