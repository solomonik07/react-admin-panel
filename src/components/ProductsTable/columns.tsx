import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Product } from '../../types/product.types';
import Icon from '../Icon/Icon';
import s from './ProductsTable.module.css';

const numericSort = (rowA: any, rowB: any, columnId: string) => {
  const valueA = Number(rowA.getValue(columnId)) || 0;
  const valueB = Number(rowB.getValue(columnId)) || 0;
  return valueA - valueB;
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price).trim();
};

interface ColumnProps {
  selectedRows: Set<number>;
  onSelectRow: (productId: number, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  dataLength: number;
}

export const createColumns = ({
  selectedRows,
  onSelectRow,
  onSelectAll,
  dataLength,
}: ColumnProps): ColumnDef<Product>[] => [
  {
    id: 'select',
    header: () => (
      <label className={s.checkboxLabel}>
        <input
          type="checkbox"
          className={s.checkbox}
          checked={selectedRows.size === dataLength && dataLength > 0}
          indeterminate={selectedRows.size > 0 && selectedRows.size < dataLength}
          onChange={(e) => onSelectAll(e.target.checked)}
          onClick={(e) => e.stopPropagation()}
        />
      </label>
    ),
    cell: ({ row }) => (
      <label className={s.checkboxLabel}>
        <input
          type="checkbox"
          className={s.checkbox}
          checked={selectedRows.has(row.original.id)}
          onChange={(e) => onSelectRow(row.original.id, e.target.checked)}
          onClick={(e) => e.stopPropagation()}
        />
      </label>
    ),
    enableSorting: false,
    size: 50,
  },
  {
    accessorKey: 'title',
    header: 'Наименование',
    cell: (info) => {
      const product = info.row.original;
      return (
        <div className={s.productInfo}>
          <img
            src={product.thumbnail}
            alt={product.title}
            className={s.productThumbnail}
          />
          <div className={s.productDetails}>
            <div className={s.productTitle}>{product.title}</div>
            <div className={s.productCategory}>{product.category || 'Без категории'}</div>
          </div>
        </div>
      );
    },
    enableSorting: true,
    sortingFn: 'text',
    size: 300,
  },
  {
    accessorKey: 'brand',
    header: 'Вендор',
    cell: (info) => {
      const brand = info.getValue() as string;
      return (
        <span className={s.brand}>
          {brand || '—'}
        </span>
      );
    },
    enableSorting: true,
    sortingFn: 'text',
    size: 150,
  },
  {
    id: 'sku',
    header: 'Артикул',
    cell: (info) => {
      const product = info.row.original;
      return (
        <span className={s.sku}>
          {product.sku || `SKU-${product.id.toString()}`}
        </span>
      );
    },
    enableSorting: false,
    size: 120,
  },
  {
    accessorKey: 'rating',
    header: 'Оценка',
    cell: (info) => {
      const rating = info.getValue() as number;
      return (
        <span className={s.rating}>
          <span className={rating < 3 ? s.lowRating : ''}>
            {rating.toFixed(1)}
          </span>/5
        </span>
      );
    },
    enableSorting: true,
    sortingFn: numericSort,
    size: 100,
  },
  {
    accessorKey: 'price',
    header: 'Цена, ₽',
    cell: (info) => {
      const price = info.getValue() as number;
      return (
        <span className={s.price}>
          {formatPrice(price)}
        </span>
      );
    },
    enableSorting: true,
    sortingFn: numericSort,
    size: 120,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <div className={s.actionButtons}>
        <button className={s.iconButton}>
          <Icon name="plus" width={18} height={18} />
        </button>
        <button className={s.iconCircleButton}>
          <Icon name="dotsThreeCircle" width={25} height={25} />
        </button>
      </div>
    ),
    enableSorting: false,
    size: 120,
  },
];