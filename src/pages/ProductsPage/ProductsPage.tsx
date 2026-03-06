import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { SortingState, PaginationState } from '@tanstack/react-table';
import { AppDispatch, RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import {
  fetchProducts,
  setCurrentPage,
  setSearchQuery,
  addProduct
} from '../../store/slices/productsSlice';
import { AddProductModal, Icon, ProgressBar, ProductsTable } from '../../components';

import s from './ProductsPage.module.css';


function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const { token } = useSelector((state: RootState) => state.auth);
  const {
    items,
    isLoading,
    error,
    totalItems,
    searchQuery
  } = useSelector((state: RootState) => state.products);

  const debouncedSearchQuery = useDebounce(localSearchQuery, 500);

  const apiSortParams = useMemo(() => {
    if (sorting.length === 0) {
      return { sortBy: null, sortOrder: 'asc' as const };
    }
    const { id, desc } = sorting[0];
    return {
      sortBy: id,
      sortOrder: desc ? 'desc' : 'asc' as const,
    };
  }, [sorting]);

  const loadProducts = useCallback(() => {
    dispatch(fetchProducts({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sortBy: apiSortParams.sortBy,
      sortOrder: apiSortParams.sortOrder,
      searchQuery
    }));
  }, [dispatch, pagination.pageIndex, pagination.pageSize, apiSortParams.sortBy, apiSortParams.sortOrder, searchQuery]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    dispatch(setCurrentPage(pagination.pageIndex + 1));
  }, [pagination.pageIndex, dispatch]);

  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearchQuery));
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [debouncedSearchQuery, dispatch]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Вы вышли из системы');
    navigate('/login');
  };

  const handleRefresh = () => {
    loadProducts();
    toast.success('Данные обновлены');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
  };

  const handleAddProduct = (product: { title: string; price: number; brand: string; sku: string }) => {
    dispatch(addProduct(product));
    toast.success('Товар успешно добавлен!');
  };

  const handleProductClick = (product: any) => {
    toast.success(`Выбран товар: ${product.title}`);
  };

  return (
    <div className={s.container}>
      {isLoading && <ProgressBar />}

      <header className={s.header}>
        <div className={s.col1}>
          <h1 className={s.title}>Товары</h1>
        </div>
        <div className={s.searchContainer}>
          <input
            type="text"
            placeholder="Найти"
            value={localSearchQuery}
            onChange={handleSearchChange}
            className={s.searchInput}
          />
          {searchQuery && (
            <span className={s.searchHint}>
            Результаты поиска: "{searchQuery}"
          </span>
          )}
        </div>
      </header>

      <main className={s.content}>
        <div className={s.contentHeader}>
          <h2>Все товары</h2>
          <div className={s.actions}>
            <button
              className={s.refreshButton}
              onClick={handleRefresh}
              disabled={isLoading}
              title="Обновить данные"
            >
              <Icon name="refresh" width={18} height={18} className={s.refreshIcon} />
            </button>
            <button
              className={s.addButton}
              onClick={() => setIsModalOpen(true)}
            >
              <Icon name="plusCircle" width={18} height={18} />
              Добавить
            </button>
            <button onClick={handleLogout} className={s.logoutButton}>
              Выход
            </button>
          </div>
        </div>

        <ProductsTable
          data={items}
          sorting={sorting}
          onSortingChange={setSorting}
          pagination={pagination}
          onPaginationChange={setPagination}
          totalItems={totalItems}
          onProductClick={handleProductClick}
        />
      </main>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddProduct}
      />
    </div>
  );
};

export default ProductsPage;