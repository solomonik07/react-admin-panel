import React from 'react';
import { Table } from '@tanstack/react-table';
import { Product } from '../../types/product.types';
import Icon from "../Icon/Icon";

import s from './TablePagination.module.css';


interface TablePaginationProps {
  table: Table<Product>;
  totalItems: number;
  selectedRowsCount?: number;
}

const TablePagination: React.FC<TablePaginationProps> = ({
 table,
 totalItems,
 selectedRowsCount = 0,
}) => {
  const startItem = totalItems === 0 ? 0 : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1;
  const endItem = Math.min(
    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
    totalItems
  );

  const getPageNumbers = () => {
    const totalPages = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex + 1;
    const delta = 2;
    const range: (number | string)[] = [];

    range.push(1);

    if (totalPages <= 7) {
      for (let i = 2; i < totalPages; i++) {
        range.push(i);
      }
    } else {
      const left = Math.max(2, currentPage - delta);
      const right = Math.min(totalPages - 1, currentPage + delta);

      if (left > 2) {
        range.push('...');
      }
      for (let i = left; i <= right; i++) {
        range.push(i);
      }
      if (right < totalPages - 1) {
        range.push('...');
      }
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={s.pagination}>
      <div className={s.paginationInfo}>
        {totalItems > 0 ? (
          <>Показано {startItem}-{endItem} из {totalItems}</>
        ) : (
          <>Нет товаров</>
        )}
        {selectedRowsCount > 0 && (
          <span className={s.selectedInfo}>
            , выбрано: {selectedRowsCount}
          </span>
        )}
      </div>

      <div className={s.paginationControls}>
        <button
          className={s.paginationArrow}
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          title="Первая страница"
        >
          <Icon name="arrowLeft" width={8} height={14} />
          <Icon name="arrowLeft" width={8} height={14} />
        </button>

        <button
          className={s.paginationArrow}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          title="Предыдущая страница"
        >
          <Icon name="arrowLeft" width={8} height={14} />
        </button>

        <div className={s.pageNumbers}>
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {typeof page === 'number' ? (
                <button
                  className={`${s.pageNumber} ${
                    page === table.getState().pagination.pageIndex + 1 ? s.activePage : ''
                  }`}
                  onClick={() => table.setPageIndex(page - 1)}
                >
                  {page}
                </button>
              ) : (
                <span className={s.ellipsis}>⋯</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          className={s.paginationArrow}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          title="Следующая страница"
        >
          <Icon name="arrowRight" width={8} height={14} />
        </button>

        <button
          className={s.paginationArrow}
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          title="Последняя страница"
        >
          <Icon name="arrowRight" width={8} height={14} />
          <Icon name="arrowRight" width={8} height={14} />
        </button>
      </div>
    </div>
  );
};

export default TablePagination;